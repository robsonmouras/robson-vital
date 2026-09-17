// Lógica e validações compartilhadas entre as Edge Functions do quiz.
// Mantida em sincronia manual com a cópia client-side em public/quiz/index.html
// (calcularResultado) — o cálculo do servidor é a fonte de verdade que grava
// no banco; a cópia no navegador só decide qual conteúdo mostrar na hora.

export const RESULTADO_KEYS = [
  'ecommerce',
  'venda_curso',
  'landing_page',
  'servicos_calendly',
  'lead_magnet',
  'lead_magnet_blog',
  'portfolio',
  'portfolio_blog',
  'institucional',
  'institucional_blog',
  'blog',
] as const;

export type ResultadoKey = typeof RESULTADO_KEYS[number];

export function calcularResultado(p1: string, p2: string, p3: string, p4: string): ResultadoKey {
  if (p1 === 'D') return 'blog';

  if (p1 === 'A') {
    if (p2 === 'B') return 'ecommerce';
    if (p2 === 'C') return p4 === 'A' ? 'venda_curso' : 'landing_page';
    return 'landing_page';
  }

  if (p1 === 'B') {
    if (p2 === 'A') return p3 === 'A' ? 'servicos_calendly' : 'lead_magnet';
    return p4 === 'A' ? 'lead_magnet_blog' : 'landing_page';
  }

  if (p1 === 'C') {
    if (p2 === 'D') return p4 === 'A' ? 'portfolio_blog' : 'portfolio';
    return p4 === 'A' ? 'institucional_blog' : 'institucional';
  }

  return 'landing_page';
}

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function emailFormatoValido(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

// Confere se o domínio do e-mail tem registro MX (ou ao menos A/AAAA como
// fallback — alguns domínios recebem email sem MX explícito). Não existe
// jeito de fazer isso no navegador; é por isso que esse passo precisa de servidor.
export async function dominioRecebeEmail(email: string): Promise<boolean> {
  const domain = email.trim().split('@')[1];
  if (!domain) return false;

  try {
    const mx = await Deno.resolveDns(domain, 'MX');
    if (mx.length > 0) return true;
  } catch (_err) {
    // sem MX — tenta fallback abaixo
  }

  try {
    const a = await Deno.resolveDns(domain, 'A');
    return a.length > 0;
  } catch (_err) {
    return false;
  }
}

export type WhatsappResult = { ok: true; numero: string } | { ok: false; erro: string };

// Aceita 41987654321, 5541987654321, (41) 98765-4321, etc. Sempre retorna
// os 11 dígitos sem o código do país (DDD + número).
export function normalizarWhatsapp(valor: string): WhatsappResult {
  const cleaned = (valor || '').replace(/\D/g, '');
  const semPais = cleaned.length === 13 && cleaned.startsWith('55') ? cleaned.slice(2) : cleaned;

  if (semPais.length !== 11) {
    return { ok: false, erro: 'WhatsApp deve ter DDD + número, 11 dígitos.' };
  }

  return { ok: true, numero: semPais };
}

export type QuizPayload = {
  nome: string;
  email: string;
  whatsapp: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  consentimento_lgpd: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
};

export type ValidationErrors = Partial<
  Record<'nome' | 'email' | 'whatsapp' | 'p1' | 'p2' | 'p3' | 'p4' | 'consentimento_lgpd', string>
>;

const P12_VALORES = ['A', 'B', 'C', 'D'];
const P34_VALORES = ['A', 'B'];

function utmValido(v: unknown): v is string | undefined {
  return v === undefined || v === null || (typeof v === 'string' && v.length <= 100);
}

export function validarCampos(body: Record<string, unknown>): { errors: ValidationErrors; payload?: QuizPayload } {
  const errors: ValidationErrors = {};

  const nome = String(body.nome ?? '').trim();
  if (nome.length < 3 || nome.length > 100) {
    errors.nome = 'Nome deve ter entre 3 e 100 caracteres.';
  }

  const email = String(body.email ?? '').trim();
  if (!emailFormatoValido(email)) {
    errors.email = 'Digite um e-mail válido.';
  }

  const whatsapp = String(body.whatsapp ?? '');
  const wa = normalizarWhatsapp(whatsapp);
  if (!wa.ok) {
    errors.whatsapp = wa.erro;
  }

  const p1 = String(body.p1 ?? '');
  const p2 = String(body.p2 ?? '');
  const p3 = String(body.p3 ?? '');
  const p4 = String(body.p4 ?? '');
  if (!P12_VALORES.includes(p1)) errors.p1 = 'Resposta inválida.';
  if (!P12_VALORES.includes(p2)) errors.p2 = 'Resposta inválida.';
  if (!P34_VALORES.includes(p3)) errors.p3 = 'Resposta inválida.';
  if (!P34_VALORES.includes(p4)) errors.p4 = 'Resposta inválida.';

  if (body.consentimento_lgpd !== true) {
    errors.consentimento_lgpd = 'É preciso aceitar o uso dos seus dados pra continuar.';
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    errors: {},
    payload: {
      nome,
      email,
      whatsapp: wa.ok ? wa.numero : '',
      p1,
      p2,
      p3,
      p4,
      consentimento_lgpd: true,
      utm_source: utmValido(body.utm_source) ? (body.utm_source as string | undefined) : undefined,
      utm_medium: utmValido(body.utm_medium) ? (body.utm_medium as string | undefined) : undefined,
      utm_campaign: utmValido(body.utm_campaign) ? (body.utm_campaign as string | undefined) : undefined,
      utm_content: utmValido(body.utm_content) ? (body.utm_content as string | undefined) : undefined,
    },
  };
}

// CORS: só o domínio do site (+ localhost pra testar em dev) pode chamar
// as functions a partir do navegador.
const ALLOWED_ORIGINS = (Deno.env.get('CORS_ORIGIN') ?? 'https://robsonvital.com.br')
  .split(',')
  .map((o) => o.trim());

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowOrigin = origin && (ALLOWED_ORIGINS.includes(origin) || /^https?:\/\/localhost(:\d+)?$/.test(origin))
    ? origin
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Vary': 'Origin',
  };
}

export function jsonResponse(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}

// Limitador best-effort: guarda contagem por IP na memória da instância.
// Não é um rate limit distribuído (cada instância fria começa do zero),
// mas barra bots básicos sem precisar de infraestrutura extra (Redis, etc).
const janelas = new Map<string, { contagem: number; expira: number }>();

export function rateLimitOk(ip: string, limite: number, janelaMs: number): boolean {
  const agora = Date.now();
  const atual = janelas.get(ip);

  if (!atual || atual.expira < agora) {
    janelas.set(ip, { contagem: 1, expira: agora + janelaMs });
    return true;
  }

  if (atual.contagem >= limite) return false;

  atual.contagem += 1;
  return true;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('cf-connecting-ip') ?? 'desconhecido';
}

// Alerta por e-mail a cada lead novo, via um Web App do Google Apps Script
// (ver apps-script-quiz-alert.gs na raiz do repositório) — evita depender de
// um provedor de e-mail transacional à parte só pra isso. Sem as duas
// secrets configuradas, não faz nada (alerta é opcional). Falha aqui nunca
// derruba o cadastro do lead, só loga.
export async function enviarAlertaLead(lead: {
  nome: string;
  email: string;
  whatsapp: string;
  resultado: string;
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
}): Promise<void> {
  const url = Deno.env.get('QUIZ_ALERT_WEBHOOK_URL');
  const segredo = Deno.env.get('QUIZ_ALERT_WEBHOOK_SECRET');
  if (!url || !segredo) return;

  const timeout = AbortSignal.timeout(5000);
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, segredo }),
      signal: timeout,
    });

    // O Apps Script responde 200 mesmo quando rejeita (ex.: segredo errado)
    // — sem checar o corpo, esse tipo de falha passaria em silêncio.
    const data = await resp.json().catch(() => null);
    if (!resp.ok || !data || data.ok !== true) {
      console.error('enviarAlertaLead: webhook não confirmou envio', resp.status, JSON.stringify(data));
    }
  } catch (err) {
    console.error('enviarAlertaLead: falha ao chamar webhook', err);
  }
}
