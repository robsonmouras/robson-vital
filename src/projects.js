import { gsap } from 'gsap';

// Caminhos de public/ montados em string (não passam pelo pipeline de
// assets do Vite, que só reescreve o que reconhece em index.html/CSS —
// ver comentário longo em vite.config.js sobre o base). Hoje base é "/",
// mas mantém o prefixo aqui pra continuar correto se voltar a publicar
// em subpasta algum dia.
const BASE_URL = import.meta.env.BASE_URL;

/**
 * Conteúdo detalhado (case study) de cada projeto, mostrado no overlay
 * em tela cheia ao clicar num tile — ver initOverlay/renderProjectBody
 * abaixo. Chave = mesmo texto de `data-name` no tile (index.html).
 * Projeto sem entrada aqui cai no aviso placeholder
 * (.project-overlay__placeholder-note).
 */
// Selo "desenvolvido para cliente da Zalieza" (ver PROJECT_CONTENT/
// buildPartnerNote), reaproveitado nos projetos captados via agência —
// hoje Jumper, Grupo RCR, Grupo Vikings e Inov9.
const ZALIEZA_PARTNER = {
  name: 'Zalieza',
  url: 'https://zalieza.com/',
  logo: {
    src: `${BASE_URL}images/logos/zalieza.svg`,
    alt: 'Logo da Zalieza',
  },
  text: 'Site desenvolvido para cliente da',
};

const PROJECT_CONTENT = {
  Jumper: {
    partner: ZALIEZA_PARTNER,
    media: {
      // Gerado a partir do print original (~1.8MB) via sharp-cli,
      // redimensionado pra 2000px de largura — ver public/images/projects.
      src: `${BASE_URL}images/projects/jumper-showcase.webp`,
      fallback: `${BASE_URL}images/projects/jumper-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Home do novo site da Jumper aberta em um notebook e um smartphone, com o título "Cuidamos da sua operação para que você cuide do seu negócio."',
    },
    url: 'https://jumperseg.com.br/',
    tags: ['GSAP', 'Animações de scroll', 'Copy de conversão'],
    sections: [
      {
        heading: 'O problema',
        text: 'A Jumper, grupo que integra segurança, facilities e tecnologia, tinha um site antigo em WordPress: visual genérico, sem hierarquia de conteúdo e nenhuma estrutura pensada para converter visita em contato. O projeto foi conduzido via Zalieza, agência responsável pela conta.',
      },
      {
        heading: 'O que eu fiz',
        text: 'Projetei e desenvolvi o site do zero, sem WordPress, usando IA como acelerador de fluxo, mas com cada tela, animação e linha de copy revisada e ajustada manualmente, sem deixar nada com "cara de gerado automaticamente". Implementei animações em GSAP orientadas a scroll para guiar o visitante pela narrativa da marca, e reescrevi o conteúdo seção por seção com foco em conversão.',
      },
      {
        heading: 'Resultado',
        text: 'Um site rápido para carregar e rápido para entregar, à altura da operação que a Jumper representa, da segurança patrimonial ao centro de controle 24/7, com uma experiência de scroll que prende atenção, conduz à ação e tem identidade própria.',
      },
    ],
  },
  'Grupo RCR': {
    partner: ZALIEZA_PARTNER,
    media: {
      // Gerado a partir do print original (~1.4MB) via sharp-cli,
      // redimensionado pra 2000px de largura — ver public/images/projects.
      src: `${BASE_URL}images/projects/rcr-showcase.webp`,
      fallback: `${BASE_URL}images/projects/rcr-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Home do novo site do Grupo RCR aberta em um notebook, com o título "Cuidar de pessoas, Proteger patrimônios, Servir com excelência".',
    },
    url: 'http://gruporcr.com.br/',
    tags: ['Código moderno (sem WordPress)', 'WordPress (blog)', 'Copy de conversão'],
    sections: [
      {
        heading: 'O problema',
        text: 'O Grupo RCR já tinha um site, mas ele não acompanhava o momento da empresa, um crescimento exponencial na sua área, e deixava a operação parecer menor do que é. O projeto foi conduzido via Zalieza, agência responsável pela conta.',
      },
      {
        heading: 'O que eu fiz',
        text: 'Desenhei o layout no Figma e validei cada tela com o cliente antes de sair codando. Só depois disso reconstruí o site institucional do zero em código moderno, sem WordPress, em torno de uma narrativa clara: "cuidar de pessoas, proteger patrimônios, servir com excelência". O blog ficou em WordPress, separado da parte institucional, pra facilitar a publicação de conteúdo pela equipe da RCR.',
      },
      {
        heading: 'Resultado',
        text: 'Uma presença digital à altura do crescimento do Grupo RCR, com um site institucional rápido e moderno e um blog fácil de manter para a própria equipe.',
      },
    ],
  },
  'Grupo Vikings': {
    partner: ZALIEZA_PARTNER,
    media: {
      // Mockup em laptop gerado a partir do print original, redimensionado
      // pra 2000px de largura via sharp-cli — ver public/images/projects.
      src: `${BASE_URL}images/projects/vikings-showcase.webp`,
      fallback: `${BASE_URL}images/projects/vikings-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Home do novo site do Grupo Vikings aberta em um notebook e um smartphone, com o título "Produtividade e atendimento de excelência em facilities e segurança."',
    },
    url: 'https://grupo-vikings.web-cf8.workers.dev/',
    tags: ['Código moderno (sem WordPress)', 'Vídeo no hero', 'PT/EN'],
    sections: [
      {
        heading: 'O problema',
        text: 'O Grupo Vikings, empresa de facilities e segurança, já tinha um site, mas antigo e defasado em relação ao momento da operação. O projeto foi conduzido via Zalieza, agência responsável pela conta.',
      },
      {
        heading: 'O que eu fiz',
        text: 'Desenvolvi o site inteiro sozinho, do zero, com um vídeo na abertura pra dar mais impacto à primeira impressão. Montei a estrutura em duas línguas, português e inglês, pra atender o alcance da operação da empresa.',
      },
      {
        heading: 'Resultado',
        text: 'Uma presença digital renovada e bilíngue, com uma abertura em vídeo que já comunica a escala do Grupo Vikings assim que o site carrega.',
      },
    ],
  },
  Inov9: {
    partner: ZALIEZA_PARTNER,
    media: {
      // Gerado a partir do print original via sharp-cli, redimensionado
      // pra 2000px de largura — ver public/images/projects.
      src: `${BASE_URL}images/projects/inov9-showcase.webp`,
      fallback: `${BASE_URL}images/projects/inov9-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Home do novo site do Grupo Inov9 aberta em um notebook, com o título "Segurança e facilities que garantem a continuidade do seu negócio."',
    },
    url: 'https://grupoinov9.com.br/',
    tags: ['WordPress', 'Elementor', 'Identidade visual'],
    sections: [
      {
        heading: 'O problema',
        text: 'O Grupo Inov9, segurança, facilities e tecnologia, ainda não tinha site. Sem presença digital, a empresa não tinha como transmitir pra quem chegava até ela o ponto em que já estava: uma operação madura e estruturada. O projeto foi conduzido via Zalieza, agência responsável pela conta.',
      },
      {
        heading: 'O que eu fiz',
        text: 'Desenhei o site inteiro no Figma primeiro e validei o projeto com o cliente antes de subir pro WordPress. Só depois construí o site em WordPress com Elementor, organizando as soluções, a metodologia e as frentes de atuação (facilities, segurança patrimonial) numa estrutura clara, com identidade visual alinhada à marca.',
      },
      {
        heading: 'Resultado',
        text: 'Um site novo que trouxe modernidade pra presença digital da Inov9 e passa, com mais fidelidade, o estágio em que a empresa está hoje.',
      },
    ],
  },
  'Kwik Ledgers': {
    media: {
      // Mockup em laptop gerado a partir da tela de cadastro, redimensionado
      // pra 2000px de largura via sharp-cli — ver public/images/projects.
      src: `${BASE_URL}images/projects/kwik-ledgers-showcase.webp`,
      fallback: `${BASE_URL}images/projects/kwik-ledgers-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Tela de cadastro do Kwik Ledgers aberta em um laptop, com seleção de tipo de pessoa, endereço e contatos.',
    },
    tags: ['UX/UI Design', 'Pesquisa & Testes de Usabilidade', 'Design System'],
    // Sequência intercalada: imagem, texto, imagem, texto, imagem, citação
    // de cliente, texto, imagem, texto — cada item cai num tipo diferente
    // dentro de renderProjectBody (default 'text', mais 'image' e 'quote').
    // Conteúdo alinhado ao case study completo em
    // Desktop/KL/Portfolio - KwikLedgers/case-study-kwikledgers.md — aqui
    // condensado pro formato mais curto do overlay.
    sections: [
      {
        type: 'image',
        // Era a imagem de capa original — trocada pelo mockup em laptop
        // acima (`content.media`) e reaproveitada aqui, logo na abertura
        // do conteúdo.
        src: `${BASE_URL}images/projects/kwik-ledgers-overview.webp`,
        fallback: `${BASE_URL}images/projects/kwik-ledgers-overview.jpg`,
        width: 1374,
        height: 996,
        alt: 'Painel "Overview" do Kwik Ledgers, com status da contabilidade, contas bancárias, lucro e despesas.',
      },
      {
        heading: 'O desafio',
        text: 'Uma plataforma de contabilidade que combina IA com revisão humana lida com dois públicos bem diferentes dentro do mesmo produto: o cliente, dono do negócio e geralmente sem conhecimento contábil, que precisa concluir um onboarding, enviar documentos e entender relatórios financeiros complexos sem se perder; e o contador, que precisa localizar, revisar e processar documentos e transações de múltiplos clientes com o mínimo de fricção possível. Uma interface mal pensada nesse contexto não gera só insatisfação — ela vira onboarding incompleto, documento enviado errado e mais tempo da equipe interna compensando a confusão de quem está do outro lado.',
      },
      {
        type: 'image',
        src: `${BASE_URL}images/projects/kwik-ledgers-profile.webp`,
        fallback: `${BASE_URL}images/projects/kwik-ledgers-profile.jpg`,
        width: 1280,
        height: 996,
        alt: 'Formulário de cadastro do Kwik Ledgers, com seleção de tipo (pessoa física/jurídica), endereço e contatos.',
      },
      {
        heading: 'Processo',
        text: 'Comecei alinhando com o time de negócio as métricas que mais importavam — conclusão do onboarding, envio correto de documentos e tempo de processamento dos contadores — pra guiar as prioridades de pesquisa e design. A partir daí, cruzei gravações de sessão e mapas de calor do Hotjar com dados de analytics pra identificar, com evidência, em quais telas os clientes hesitavam ou desistiam, e validei essas hipóteses com testes de usabilidade antes de qualquer mudança de layout ir pra produção.',
      },
      {
        type: 'image',
        src: `${BASE_URL}images/projects/kwik-ledgers-design-system.webp`,
        fallback: `${BASE_URL}images/projects/kwik-ledgers-design-system.jpg`,
        width: 1300,
        height: 880,
        alt: 'Paleta de cores do design system do Kwik Ledgers — background, primária, secundária, sucesso, erro, desabilitado e CTA, cada uma com o código hexadecimal.',
      },
      {
        type: 'quote',
        text: '"Recomendando a contratação do Robson, ele conduziu pesquisas e redesenhou a interface com base em testes de usabilidade, o que resultou em uma experiência mais fluida e em uma base de usuários mais satisfeita e engajada."',
        author: 'Israel Zeferino',
        role: 'Sênior Product Owner / Product Manager',
        avatar: {
          src: `${BASE_URL}images/projects/kwik-ledgers-israel-zeferino.webp`,
          fallback: `${BASE_URL}images/projects/kwik-ledgers-israel-zeferino.jpg`,
          alt: 'Retrato de Israel Zeferino',
        },
      },
      {
        heading: 'Fluxos principais',
        text: 'Com os achados validados, construí um design system consistente — cores, tipografia, botões, inputs, cards, modais e estados de pagamento — pra dar previsibilidade visual à medida que o produto crescia, e apliquei essa base nos principais fluxos: onboarding e autenticação, gestão de empresas e sócios, dashboard financeiro, contas bancárias, métodos de pagamento, planos e checkout, relatórios financeiros e notificações. Trabalhei em conjunto com o desenvolvimento em cada etapa, pra garantir que as soluções fossem viáveis tecnicamente, não só consistentes na tela.',
      },
      {
        type: 'image',
        src: `${BASE_URL}images/projects/kwik-ledgers-documents.webp`,
        fallback: `${BASE_URL}images/projects/kwik-ledgers-documents.jpg`,
        width: 1280,
        height: 886,
        alt: 'Tela de gestão de documentos do Kwik Ledgers, com status de envio de EIN, contrato social e comprovante de endereço.',
      },
      {
        heading: 'Resultado',
        text: 'Depois das melhorias de layout aplicadas a partir dos testes de usabilidade e da análise comportamental, os números confirmaram o que a pesquisa já apontava:',
      },
      {
        type: 'stats',
        items: [
          { value: '+17%', label: 'na conclusão de onboarding e envio de documentos pelos clientes' },
          { value: '+24%', label: 'na produtividade da equipe de contadores' },
        ],
      },
      {
        text: 'Cruzar pesquisa qualitativa com dados de Hotjar e analytics foi o que deu segurança pra priorizar as mudanças certas junto aos stakeholders — em vez de redesenhar por intuição, cada ajuste partiu de um ponto de fricção observado e comprovado, com o impacto medido depois da entrega.',
      },
    ],
  },
};

/**
 * Seção Projetos: grid de logos com popover que segue o cursor, e
 * overlay de projeto em tela cheia. A cabeça permanece inteira (sem
 * corte) em todas as seções — ver hero.js, que só cuida do dock na
 * lateral esquerda.
 */
export function initProjects({ lenis }) {
  const section = document.getElementById('projects');
  if (!section) return;

  initTilePopovers();
  initOverlay({ lenis });
}

/**
 * Popover que acompanha o cursor dentro do retângulo de cada tile.
 * `xPercent`/`yPercent` são fixados uma vez (centraliza o balão sobre o
 * ponteiro) e só o x/y em px é animado depois — mesma técnica do nome
 * no hero.js, pra não brigar com o transform de centralização.
 */
function initTilePopovers() {
  const tiles = document.querySelectorAll('.project-tile');

  tiles.forEach((tile) => {
    const popover = tile.querySelector('.project-tile__popover');
    const logo = tile.querySelector('.project-tile__logo');
    if (!popover) return;

    gsap.set(popover, { xPercent: -50, yPercent: -100 });
    const setX = gsap.quickTo(popover, 'x', { duration: 0.35, ease: 'power3' });
    const setY = gsap.quickTo(popover, 'y', { duration: 0.35, ease: 'power3' });

    // Fallback: se o arquivo do logo não carregar (placeholder ainda não
    // substituído por um arquivo real), mostra o nome da empresa no
    // lugar da imagem em vez de deixar um ícone de imagem quebrada.
    if (logo) {
      logo.addEventListener(
        'error',
        () => tile.classList.add('project-tile--broken'),
        { once: true }
      );
    }

    function move(event) {
      const rect = tile.getBoundingClientRect();
      const popRect = popover.getBoundingClientRect();
      const halfW = popRect.width / 2 || 40;
      const popH = popRect.height || 30;
      const gap = 14; // respiro entre o popover e a borda do tile

      const minX = halfW + gap;
      const maxX = Math.max(minX, rect.width - halfW - gap);
      const minY = popH + gap;
      const maxY = Math.max(minY, rect.height - gap);

      const x = clamp(event.clientX - rect.left, minX, maxX);
      const y = clamp(event.clientY - rect.top, minY, maxY);

      setX(x);
      setY(y);
    }

    tile.addEventListener('pointerenter', (event) => {
      gsap.to(popover, { opacity: 1, duration: 0.2 });
      move(event);
    });
    tile.addEventListener('pointermove', move);
    tile.addEventListener('pointerleave', () => {
      gsap.to(popover, { opacity: 0, duration: 0.2 });
    });
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Overlay de projeto em tela cheia (ver estrutura em index.html).
 * Popula nome/serviço a partir do tile clicado, monta o case study
 * (imagem + texto) via renderProjectBody/PROJECT_CONTENT, e cuida de
 * abrir/fechar com foco e scroll travados.
 */
function initOverlay({ lenis }) {
  const overlay = document.getElementById('projectOverlay');
  const closeBtn = document.getElementById('projectOverlayClose');
  const scroller = document.getElementById('projectOverlayScroll');
  const tiles = document.querySelectorAll('.project-tile');
  if (!overlay || !closeBtn) return;

  const nameField = overlay.querySelector('[data-field="name"]');
  const visitRowField = overlay.querySelector('[data-visit-row]');
  const serviceField = overlay.querySelector('[data-field="service"]');
  const mediaField = overlay.querySelector('[data-project-media]');
  const bodyField = overlay.querySelector('[data-project-body]');
  const moreField = overlay.querySelector('[data-project-more]');
  const placeholderNote = overlay.querySelector('[data-placeholder-note]');

  let lastFocused = null;
  let currentSlug = null;
  // true só quando empilhamos uma entrada nossa no histórico (pushState) —
  // aí `close()` pode dar `history.back()` com segurança. Troca de projeto
  // pelos cards "Veja outros projetos" usa replaceState e não mexe nisto,
  // então voltar continua fechando o overlay direto, sem reabrir o case
  // anterior "por cima".
  let pushedHistoryEntry = false;

  /**
   * URL própria por projeto, pra rastrear no GTM/Analytics qual case é
   * mais visto e permitir link direto. Usa hash (`#/projetos/<slug>`) em
   * vez de caminho real porque o site é estático no GitHub Pages — hash
   * não precisa de fallback de servidor e não corre risco de SEO.
   * Slug = `data-slug` do tile (ver index.html).
   */
  const PROJECT_HASH_PREFIX = '#/projetos/';
  const slugToTile = new Map();
  tiles.forEach((tile) => {
    if (tile.dataset.slug) slugToTile.set(tile.dataset.slug, tile);
  });

  function slugFromHash() {
    const hash = window.location.hash;
    return hash.startsWith(PROJECT_HASH_PREFIX)
      ? decodeURIComponent(hash.slice(PROJECT_HASH_PREFIX.length))
      : null;
  }

  // `syncUrl: false` quando a abertura veio da própria URL (deep link ou
  // botão voltar/avançar) — aí o histórico já está no estado certo e não
  // se deve empilhar outra entrada.
  // `replaceUrl: true` quando a troca partiu de dentro do próprio overlay
  // (cards "Veja outros projetos") — substitui a entrada atual em vez de
  // empilhar, pra não abrir um case "por cima" do outro: voltar fecha o
  // overlay direto, sem passar pelo projeto anterior.
  function open(tile, { syncUrl = true, replaceUrl = false } = {}) {
    const slug = tile.dataset.slug || null;

    if (nameField) nameField.textContent = tile.dataset.name || '';
    if (serviceField) serviceField.textContent = tile.dataset.service || '';
    renderProjectBody(tile.dataset.name);
    renderMoreProjects(slug);
    if (scroller) {
      scroller.scrollTop = 0;
      scroller.classList.remove('is-scrolled');
    }

    if (!overlay.classList.contains('is-open')) {
      lastFocused = document.activeElement;
    }
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.body.classList.add('has-overlay');
    lenis?.stop();
    closeBtn.focus();

    currentSlug = slug;

    if (slug && syncUrl) {
      if (replaceUrl) {
        window.history.replaceState(
          { project: slug },
          '',
          PROJECT_HASH_PREFIX + slug
        );
      } else {
        window.history.pushState(
          { project: slug },
          '',
          PROJECT_HASH_PREFIX + slug
        );
        pushedHistoryEntry = true;
      }
    }

    if (slug) {
      // Evento explícito pro GTM/GA4 — mais confiável do que depender do
      // gatilho de History Change pra medir visualização de cada case.
      window.dataLayer?.push({
        event: 'view_project',
        project_name: tile.dataset.name || '',
        project_slug: slug,
      });
    }
  }

  /**
   * Monta imagem + texto do case study a partir de PROJECT_CONTENT.
   * A imagem vai pro slot `mediaField` (fora de `.project-overlay__inner`,
   * pra ocupar a largura cheia — ver style.css); nome/serviço (markup
   * estático) ficam logo abaixo dela; tags/textos vão pro `bodyField`.
   * Sem entrada pro projeto: limpa tudo e deixa só o aviso placeholder
   * visível (ver .project-overlay__placeholder-note).
   */
  function renderProjectBody(projectName) {
    if (!bodyField) return;
    bodyField.innerHTML = '';
    if (mediaField) mediaField.innerHTML = '';
    if (visitRowField) visitRowField.innerHTML = '';

    const content = PROJECT_CONTENT[projectName];
    if (!content) {
      if (placeholderNote) placeholderNote.hidden = false;
      return;
    }
    if (placeholderNote) placeholderNote.hidden = true;

    if (content.media && mediaField) {
      const picture = document.createElement('picture');
      if (content.media.src.endsWith('.webp') && content.media.fallback) {
        const source = document.createElement('source');
        source.srcset = content.media.src;
        source.type = 'image/webp';
        picture.appendChild(source);
      }

      const img = document.createElement('img');
      img.src = content.media.fallback || content.media.src;
      img.alt = content.media.alt || '';
      if (content.media.width) img.width = content.media.width;
      if (content.media.height) img.height = content.media.height;
      img.loading = 'lazy';
      img.decoding = 'async';
      picture.appendChild(img);

      mediaField.appendChild(picture);

      // Seta animada sobre a imagem de capa, avisando que dá pra rolar
      // pra ver o case study. Some assim que o usuário rola
      // (ver .is-scrolled em initOverlay e .project-overlay__scroll-hint
      // no CSS).
      const scrollHint = document.createElement('div');
      scrollHint.className = 'project-overlay__scroll-hint';
      scrollHint.setAttribute('aria-hidden', 'true');
      scrollHint.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>';
      mediaField.appendChild(scrollHint);
    }

    // Botão "ver site no ar" logo abaixo do título (ver .project-overlay__visit-row).
    // Só aparece pra quem tem `url` no PROJECT_CONTENT (limpo no topo
    // desta função a cada render).
    if (content.url && visitRowField) {
      const link = document.createElement('a');
      link.className = 'project-overlay__visit-cta';
      link.href = content.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></svg><span>Ver projeto no ar</span>';
      visitRowField.appendChild(link);
    }

    if (content.tags?.length) {
      const tagList = document.createElement('div');
      tagList.className = 'project-overlay__tags';
      content.tags.forEach((tag) => {
        const span = document.createElement('span');
        span.className = 'project-overlay__tag';
        span.textContent = tag;
        tagList.appendChild(span);
      });
      bodyField.appendChild(tagList);
    }

    content.sections?.forEach((section) => {
      // Imagem intercalada no meio do texto (não confundir com
      // `content.media`, a única imagem "de capa" no topo do overlay).
      if (section.type === 'image') {
        bodyField.appendChild(buildInlineImage(section));
        return;
      }

      // Citação de cliente/stakeholder sobre o trabalho.
      if (section.type === 'quote') {
        bodyField.appendChild(buildQuote(section));
        return;
      }

      // Números de resultado em destaque (ver PROJECT_CONTENT, `sections`
      // com `type: 'stats'`) — usado pra dar peso visual a métricas de
      // impacto em vez de deixá-las perdidas no meio do parágrafo.
      if (section.type === 'stats') {
        bodyField.appendChild(buildStats(section));
        return;
      }

      const wrap = document.createElement('div');
      wrap.className = 'project-overlay__section';

      // `heading` é opcional — permite emendar um parágrafo de
      // continuação (ex.: logo antes/depois de um bloco de `stats`) sem
      // repetir o título da seção anterior.
      if (section.heading) {
        const heading = document.createElement('h3');
        heading.className = 'project-overlay__section-heading';
        heading.textContent = section.heading;
        wrap.appendChild(heading);
      }

      const text = document.createElement('p');
      text.className = 'project-overlay__section-text';
      text.textContent = section.text;

      wrap.appendChild(text);
      bodyField.appendChild(wrap);
    });

    // Selo do parceiro por último, fechando o case study.
    if (content.partner) {
      bodyField.appendChild(buildPartnerNote(content.partner));
    }
  }

  /**
   * "Veja outros projetos" no fim do case study: até 3 projetos
   * sorteados, fora o que está aberto e os marcados como "em andamento"
   * (ainda sem case pra mostrar). Clicar num card abre aquele projeto no
   * mesmo overlay — reusa `open`, que já cuida de histórico, scroll e
   * evento de GTM.
   */
  function renderMoreProjects(currentSlug) {
    if (!moreField) return;
    moreField.innerHTML = '';

    const pool = [...tiles].filter(
      (tile) =>
        tile.dataset.slug &&
        tile.dataset.slug !== currentSlug &&
        !tile.querySelector('.project-tile__wip')
    );

    // Fisher–Yates pra sortear sem viés, depois pega no máximo 3.
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const picks = pool.slice(0, 3);

    if (!picks.length) {
      moreField.hidden = true;
      return;
    }
    moreField.hidden = false;

    const heading = document.createElement('h3');
    heading.className = 'project-overlay__more-heading';
    heading.textContent = 'Veja outros projetos';
    moreField.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'project-overlay__more-grid';

    picks.forEach((tile) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'project-overlay__more-card';
      card.setAttribute('aria-label', tile.dataset.name || '');
      if (tile.classList.contains('project-tile--dark')) {
        card.classList.add('project-overlay__more-card--dark');
      }

      const logo = tile.querySelector('.project-tile__logo');
      if (logo) {
        const img = document.createElement('img');
        img.className = 'project-overlay__more-logo';
        img.src = logo.currentSrc || logo.src;
        img.alt = tile.dataset.name || logo.alt || '';
        img.loading = 'lazy';
        img.decoding = 'async';
        // Sem logo carregado, mostra o nome no lugar da imagem quebrada
        // (mesmo fallback dos tiles — ver .project-tile--broken).
        img.addEventListener(
          'error',
          () => {
            img.remove();
            const name = document.createElement('span');
            name.className = 'project-overlay__more-name';
            name.textContent = tile.dataset.name || '';
            card.appendChild(name);
          },
          { once: true }
        );
        card.appendChild(img);
      } else {
        const name = document.createElement('span');
        name.className = 'project-overlay__more-name';
        name.textContent = tile.dataset.name || '';
        card.appendChild(name);
      }

      card.addEventListener('click', () => open(tile, { replaceUrl: true }));

      grid.appendChild(card);
    });

    moreField.appendChild(grid);
  }

  /**
   * Imagem intercalada entre seções de texto (ver PROJECT_CONTENT,
   * `sections` com `type: 'image'`). Mesma montagem picture/webp+fallback
   * de `content.media`, só que presa à largura do texto (.project-overlay__inner)
   * em vez de tela cheia — ver .project-overlay__inline-image no CSS.
   */
  function buildInlineImage(section) {
    const figure = document.createElement('figure');
    figure.className = 'project-overlay__inline-image';

    const picture = document.createElement('picture');
    if (section.src?.endsWith('.webp') && section.fallback) {
      const source = document.createElement('source');
      source.srcset = section.src;
      source.type = 'image/webp';
      picture.appendChild(source);
    }

    const img = document.createElement('img');
    img.src = section.fallback || section.src;
    img.alt = section.alt || '';
    if (section.width) img.width = section.width;
    if (section.height) img.height = section.height;
    img.loading = 'lazy';
    img.decoding = 'async';
    picture.appendChild(img);

    figure.appendChild(picture);
    return figure;
  }

  /**
   * Citação de cliente/stakeholder (ver PROJECT_CONTENT, `sections` com
   * `type: 'quote'`). `author`/`role` são opcionais — sem eles, mostra só
   * o texto da citação.
   */
  function buildQuote(section) {
    const quote = document.createElement('blockquote');
    quote.className = 'project-overlay__quote';

    const text = document.createElement('p');
    text.className = 'project-overlay__quote-text';
    text.textContent = section.text;
    quote.appendChild(text);

    if (section.author) {
      const footer = document.createElement('footer');
      footer.className = 'project-overlay__quote-author';

      // Avatar pequeno e redondo ao lado do nome — opcional, só entra
      // quando a citação tem `avatar` no PROJECT_CONTENT.
      if (section.avatar) {
        const picture = document.createElement('picture');
        if (section.avatar.src?.endsWith('.webp') && section.avatar.fallback) {
          const source = document.createElement('source');
          source.srcset = section.avatar.src;
          source.type = 'image/webp';
          picture.appendChild(source);
        }

        const avatarImg = document.createElement('img');
        avatarImg.className = 'project-overlay__quote-avatar';
        avatarImg.src = section.avatar.fallback || section.avatar.src;
        avatarImg.alt = section.avatar.alt || '';
        avatarImg.loading = 'lazy';
        avatarImg.decoding = 'async';
        picture.appendChild(avatarImg);

        footer.appendChild(picture);
      }

      const info = document.createElement('div');
      info.className = 'project-overlay__quote-author-info';

      const cite = document.createElement('cite');
      cite.textContent = section.author;
      info.appendChild(cite);

      if (section.role) {
        const role = document.createElement('span');
        role.className = 'project-overlay__quote-role';
        role.textContent = section.role;
        info.appendChild(role);
      }

      footer.appendChild(info);
      quote.appendChild(footer);
    }

    return quote;
  }

  /**
   * Números de resultado em destaque (ver PROJECT_CONTENT, `sections` com
   * `type: 'stats'`) — cada item é `{ value, label }`, renderizado lado a
   * lado (empilha no mobile via CSS, ver .project-overlay__stats).
   */
  function buildStats(section) {
    const row = document.createElement('div');
    row.className = 'project-overlay__stats';

    section.items?.forEach((item) => {
      const stat = document.createElement('div');
      stat.className = 'project-overlay__stat';

      const value = document.createElement('strong');
      value.className = 'project-overlay__stat-value';
      value.textContent = item.value;

      const label = document.createElement('span');
      label.className = 'project-overlay__stat-label';
      label.textContent = item.label;

      stat.append(value, label);
      row.appendChild(stat);
    });

    return row;
  }

  /**
   * Selo "desenvolvido para cliente da [parceiro]" (ver ZALIEZA_PARTNER em
   * PROJECT_CONTENT) — projetos captados via agência, não diretamente pelo
   * cliente final. Link sai em nova aba, igual o CTA "ver site no ar".
   */
  function buildPartnerNote(partner) {
    const note = document.createElement('a');
    note.className = 'project-overlay__partner-note';
    note.href = partner.url;
    note.target = '_blank';
    note.rel = 'noopener noreferrer';

    const text = document.createElement('span');
    text.textContent = partner.text;
    note.appendChild(text);

    if (partner.logo) {
      const img = document.createElement('img');
      img.className = 'project-overlay__partner-logo';
      img.src = partner.logo.src;
      img.alt = partner.logo.alt || partner.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      note.appendChild(img);
    } else {
      const name = document.createElement('strong');
      name.textContent = partner.name;
      note.appendChild(name);
    }

    return note;
  }

  function close({ syncUrl = true } = {}) {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('has-overlay');
    lenis?.start();
    if (lastFocused instanceof HTMLElement) lastFocused.focus();

    currentSlug = null;

    // Só mexe na URL quando o fechamento partiu de um gesto do usuário
    // (botão, fundo, Escape). Se veio do popstate (voltar), a URL já
    // está limpa.
    if (syncUrl && slugFromHash()) {
      if (pushedHistoryEntry) {
        // Abrimos via clique (empilhamos uma entrada): voltar remove o
        // hash e mantém o histórico consistente. Um replaceState posterior
        // (troca de projeto pelos cards) não conta — segue sendo a mesma
        // entrada empilhada aqui.
        window.history.back();
      } else {
        // Deep link direto, sem entrada nossa pra voltar: só troca a URL.
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search
        );
      }
    }

    pushedHistoryEntry = false;
  }

  // Voltar/avançar do navegador: sincroniza o overlay com a URL.
  window.addEventListener('popstate', () => {
    const slug = slugFromHash();
    const tile = slug ? slugToTile.get(slug) : null;

    if (tile && !tile.querySelector('.project-tile__wip')) {
      if (slug !== currentSlug) open(tile, { syncUrl: false });
    } else if (overlay.classList.contains('is-open')) {
      close({ syncUrl: false });
    }
  });

  // Link direto (`robsonvital.com.br/#/projetos/jumper`): abre o case já
  // no carregamento.
  const initialSlug = slugFromHash();
  const initialTile = initialSlug ? slugToTile.get(initialSlug) : null;
  if (initialTile && !initialTile.querySelector('.project-tile__wip')) {
    open(initialTile, { syncUrl: false });
  }

  // Tiles marcados como "em andamento" (ver .project-tile__wip no
  // index.html) ainda não têm case study pra mostrar — não abre o
  // overlay nesses, só no clique de tiles concluídos. Tiles que são
  // link (<a>, ex.: Moodboard Studio) têm página de case própria e
  // navegam pra ela no clique — não passam pelo overlay.
  tiles.forEach((tile) => {
    if (tile.tagName === 'A') return;
    if (tile.querySelector('.project-tile__wip')) return;
    tile.addEventListener('click', () => open(tile));
  });

  // Rolou um tico: esconde a seta animada da capa (ver
  // .project-overlay__scroll-hint no CSS).
  if (scroller) {
    scroller.addEventListener(
      'scroll',
      () => {
        scroller.classList.toggle('is-scrolled', scroller.scrollTop > 24);
      },
      { passive: true }
    );
  }

  closeBtn.addEventListener('click', close);

  // Clique no fundo (fora do conteúdo) também fecha. Com o wrapper
  // `__scroll` cobrindo todo o overlay (inset:0), o "fundo" clicável é
  // o próprio scroller fora do `__inner` — não mais `overlay` direto.
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target === scroller) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
      // A tela de contato (ver contact.js) pode estar aberta por cima
      // deste overlay — nesse caso é ela quem deve fechar primeiro; seu
      // próprio listener de Escape cuida disso.
      const contactOverlay = document.getElementById('contactOverlay');
      if (contactOverlay?.classList.contains('is-open')) return;
      close();
    }
  });
}
