/**
 * Briefing de identidade visual — back-end.
 *
 * Este arquivo não roda no site: o conteúdo dele é colado no editor do Apps
 * Script vinculado à planilha (Extensões › Apps Script). Fica versionado aqui
 * só para o código do back-end não existir apenas dentro do Google.
 *
 * O que ele faz a cada envio:
 *   1. valida o token do Cloudflare Turnstile no servidor;
 *   2. cria uma aba nova com o nome do cliente e as respostas em leitura vertical;
 *   3. registra uma linha na aba "Resumo", com link para a aba do cliente.
 *
 * Configuração em Configurações do projeto › Propriedades do script:
 *   TURNSTILE_SECRET  (obrigatório)  secret key do widget
 *   NOTIFY_EMAIL      (opcional)     e-mail que recebe aviso de novo briefing
 *   SPREADSHEET_ID    (opcional)     só se o script não estiver vinculado à planilha
 */

const RESUMO_SHEET = 'Resumo';
const RESUMO_HEADERS = ['Data', 'Empresa / marca', 'Nome', 'E-mail', 'WhatsApp', 'Entregáveis', 'Prazo', 'Briefing'];

/**
 * Rótulos das perguntas, na ordem em que aparecem na aba do cliente.
 * As chaves batem com os atributos name= do formulário. O texto vem daqui, e
 * não do navegador: assim o que é gravado na planilha não depende do que o
 * cliente mandar no corpo da requisição.
 */
const SECTIONS = [
  {
    title: 'Seus dados',
    fields: [
      ['nome', 'Nome'],
      ['empresa', 'Empresa ou marca'],
      ['email', 'E-mail'],
      ['whatsapp', 'WhatsApp']
    ]
  },
  {
    title: 'Sobre o negócio',
    fields: [
      ['q_o_que_fazem', 'O que vocês fazem, em poucas palavras?'],
      ['q_onde_chegar', 'Onde vocês querem chegar nos próximos anos?'],
      ['q_concorrentes', 'Quem são seus principais concorrentes?'],
      ['q_diferencial', 'O que te faz diferente deles?']
    ]
  },
  {
    title: 'Sobre o cliente de vocês',
    fields: [
      ['q_quem_compra', 'Quem compra de vocês? Como é essa pessoa?'],
      ['q_onde_ve', 'Onde ela costuma ver vocês primeiro?'],
      ['q_onde_ve_outro', 'Outro (onde ela vê vocês)'],
      ['q_sentir', 'O que você quer que ela sinta ao ver a marca?'],
      ['q_sentir_outro', 'Outro (o que ela deve sentir)']
    ]
  },
  {
    title: 'Sobre o estilo da marca',
    fields: [
      ['q_marca_pessoa', 'Se a marca fosse uma pessoa, como ela seria?'],
      ['q_tres_palavras', '3 palavras que combinam com a marca'],
      ['q_tres_palavras_nao', '3 palavras que não têm nada a ver'],
      ['q_inspiracao', 'Marcas que inspiram'],
      ['q_nao_parecer', 'Marca com que não quer parecer']
    ]
  },
  {
    title: 'Onde o logo vai aparecer',
    fields: [
      ['q_onde_logo', 'Onde o logo vai ser usado?'],
      ['q_onde_logo_outro', 'Outro (onde o logo vai ser usado)'],
      ['q_tem_logo', 'Vocês já têm um logo hoje?'],
      ['q_logo_opiniao', 'O que gosta e o que não gosta no logo atual']
    ]
  },
  {
    title: 'Cores e visual',
    fields: [
      ['q_cor_obrigatoria', 'Cor obrigatória'],
      ['q_cor_evitar', 'Cor ou estilo a evitar'],
      ['q_fotos', 'Fotos existentes ou criação do zero']
    ]
  },
  {
    title: 'Pra fechar o combinado',
    fields: [
      ['q_entregaveis', 'O que precisa receber no final'],
      ['q_aprovador', 'Quem aprova de dentro da empresa'],
      ['q_prazo', 'Pra quando precisa'],
      ['q_recado', 'Recado ou detalhe extra']
    ]
  }
];

/** Teste rápido de que a implantação está no ar: abra a URL no navegador. */
function doGet() {
  return json({ ok: true, service: 'briefing' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const fields = body.fields || {};

    // Armadilha e tempo mínimo derrubam robô comum sem gastar chamada de rede.
    // A resposta é "ok" de propósito: um erro explícito só ensinaria o robô a
    // tentar de outro jeito.
    if (body.trap) return json({ ok: true });
    if (Number(body.elapsedMs) < 8000) return json({ ok: true });

    if (!verifyTurnstile(body.token)) {
      return json({ ok: false, error: 'Verificação de segurança não confirmada.' });
    }

    if (!String(fields.empresa || '').trim() || !String(fields.email || '').trim()) {
      return json({ ok: false, error: 'Empresa e e-mail são obrigatórios.' });
    }

    // Duas requisições simultâneas poderiam criar a mesma aba duas vezes
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const ss = getSpreadsheet();
      const sheet = createClientSheet(ss, fields);
      appendResumo(ss, sheet, fields);
      notify(fields, ss.getUrl() + '#gid=' + sheet.getSheetId());
    } finally {
      lock.releaseLock();
    }

    return json({ ok: true });
  } catch (error) {
    // O motivo vai junto na resposta: sem isso, qualquer falha aqui vira uma
    // mensagem genérica no navegador e só dá para investigar pelo painel de
    // execuções. São mensagens escritas por nós, não stack trace.
    console.error(error);
    return json({ ok: false, error: 'Erro ao gravar o briefing: ' + error.message });
  }
}

/* --------------------------------------------------------------- turnstile */

function verifyTurnstile(token) {
  const secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');

  // Sem secret configurada o envio é recusado: liberar seria o mesmo que não
  // ter proteção nenhuma, já que a URL do Web App é pública.
  if (!secret) throw new Error('TURNSTILE_SECRET não configurada nas propriedades do script.');
  if (!token) return false;

  const response = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: secret, response: token },
    muteHttpExceptions: true
  });

  const result = JSON.parse(response.getContentText());
  if (!result.success) console.warn('Turnstile recusou: ' + JSON.stringify(result['error-codes']));
  return result.success === true;
}

/* ------------------------------------------------------------- planilha */

function getSpreadsheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');

  // Aceita tanto o ID puro quanto a URL inteira colada da barra de endereços:
  // o openById() só entende o ID, e a mensagem que ele dá quando recebe a URL
  // não ajuda em nada a descobrir isso.
  if (id) {
    const match = id.match(/[-\w]{25,}/);
    if (!match) throw new Error('SPREADSHEET_ID não parece um ID de planilha: ' + id);
    return SpreadsheetApp.openById(match[0]);
  }

  // getActiveSpreadsheet() devolve null quando o script foi criado avulso, em vez
  // de a partir da planilha. Sem este aviso o erro só apareceria lá na frente,
  // como "cannot read property of null".
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error('o script não está vinculado a uma planilha. Preencha SPREADSHEET_ID nas propriedades do script.');
  }
  return active;
}

/** Uma aba por cliente, com as respostas empilhadas em duas colunas. */
function createClientSheet(ss, fields) {
  const sheet = ss.insertSheet(uniqueSheetName(ss, fields.empresa));
  const rows = [];
  const sectionRows = [];

  rows.push(['Briefing de identidade visual', String(fields.empresa || '').trim()]);
  rows.push(['Recebido em', formatDate(new Date())]);

  SECTIONS.forEach(section => {
    rows.push(['', '']);
    sectionRows.push(rows.length); // 1-based: a linha do título é a que acabou de entrar
    rows.push([section.title.toUpperCase(), '']);

    section.fields.forEach(pair => {
      const value = formatValue(fields[pair[0]]);
      // campos condicionais em branco ("Outro", opinião sobre o logo atual) só
      // poluiriam a leitura
      if (value === '' && pair[0].indexOf('_outro') > -1) return;
      rows.push([pair[1], value]);
    });
  });

  sheet.getRange(1, 1, rows.length, 2).setValues(rows);

  sheet.setColumnWidth(1, 320);
  sheet.setColumnWidth(2, 640);
  sheet.getRange(1, 1, rows.length, 2).setVerticalAlignment('top').setWrap(true);

  sheet.getRange('A1:B1').setFontSize(14).setFontWeight('bold');
  sheet.getRange('A2:B2').setFontColor('#64748b');

  sectionRows.forEach(row => {
    sheet.getRange(row, 1, 1, 2)
      .setBackground('#0f172a')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
  });

  sheet.setFrozenRows(2);
  return sheet;
}

/**
 * Nome de aba válido: o Sheets recusa : \ / ? * [ ] e nomes repetidos,
 * e corta acima de 100 caracteres.
 */
function uniqueSheetName(ss, empresa) {
  let base = String(empresa || 'Cliente').replace(/[:\\\/\?\*\[\]]/g, ' ').trim().slice(0, 90);
  if (!base) base = 'Cliente';

  let name = base;
  let n = 2;
  while (ss.getSheetByName(name)) {
    name = base + ' (' + n + ')';
    n++;
  }
  return name;
}

/** Índice de todos os briefings, com link para a aba de cada um. */
function appendResumo(ss, clientSheet, fields) {
  let resumo = ss.getSheetByName(RESUMO_SHEET);

  if (!resumo) {
    resumo = ss.insertSheet(RESUMO_SHEET, 0);
    resumo.appendRow(RESUMO_HEADERS);
    resumo.getRange(1, 1, 1, RESUMO_HEADERS.length)
      .setBackground('#0f172a')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    resumo.setFrozenRows(1);
    resumo.setColumnWidths(1, RESUMO_HEADERS.length, 180);
  }

  resumo.appendRow([
    formatDate(new Date()),
    fields.empresa,
    fields.nome,
    fields.email,
    fields.whatsapp,
    formatValue(fields.q_entregaveis),
    fields.q_prazo,
    ''
  ]);

  // Link por texto formatado, e não por fórmula =HYPERLINK(): o separador de
  // argumentos de fórmula muda conforme o idioma da planilha (";" ou ","), então
  // a fórmula quebraria dependendo da conta que abrisse o arquivo.
  const link = SpreadsheetApp.newRichTextValue()
    .setText('Abrir aba')
    .setLinkUrl(ss.getUrl() + '#gid=' + clientSheet.getSheetId())
    .build();

  resumo.getRange(resumo.getLastRow(), RESUMO_HEADERS.length).setRichTextValue(link);
}

/* ---------------------------------------------------------------- apoio */

/** Caixas de seleção chegam como lista; o resto vira texto. */
function formatValue(value) {
  if (Array.isArray(value)) return value.join('\n');
  if (value === true) return 'Sim';
  if (value === false) return 'Não';
  return String(value == null ? '' : value).trim();
}

function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
}

function notify(fields, url) {
  const to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!to) return;

  // Um aviso que não chega não pode derrubar um briefing que já foi gravado
  try {
    MailApp.sendEmail({
      to: to,
      subject: 'Novo briefing: ' + fields.empresa,
      htmlBody:
        '<p><strong>' + fields.nome + '</strong> (' + fields.empresa + ') enviou o briefing.</p>' +
        '<p>E-mail: ' + fields.email + '<br>WhatsApp: ' + (fields.whatsapp || '—') + '</p>' +
        '<p><a href="' + url + '">Abrir na planilha</a></p>'
    });
  } catch (error) {
    console.warn('Falha ao enviar o aviso por e-mail: ' + error);
  }
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
