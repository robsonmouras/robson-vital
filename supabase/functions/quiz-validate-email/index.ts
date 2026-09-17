// POST /functions/v1/quiz-validate-email
// Validação em tempo real (ex.: no blur do campo de e-mail), separada do
// submit final. Só checa formato + domínio — não grava nada.
import { clientIp, corsHeaders, dominioRecebeEmail, emailFormatoValido, jsonResponse, rateLimitOk } from '../_shared/quiz.ts';

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders(origin) });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ valid: false, message: 'Método não permitido.' }, 405, origin);
  }

  const ip = clientIp(req);
  if (!rateLimitOk(ip, 30, 60_000)) {
    return jsonResponse({ valid: false, message: 'Muitas tentativas. Aguarde um minuto.' }, 429, origin);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (_err) {
    return jsonResponse({ valid: false, message: 'JSON inválido.' }, 400, origin);
  }

  const email = String(body.email ?? '').trim();

  if (!emailFormatoValido(email)) {
    return jsonResponse({ valid: false, email, domain_exists: false, message: 'E-mail com formato inválido.' }, 200, origin);
  }

  const domainExists = await dominioRecebeEmail(email);

  return jsonResponse(
    domainExists
      ? { valid: true, email, domain_exists: true }
      : { valid: false, email, domain_exists: false, message: 'Domínio não existe.' },
    200,
    origin,
  );
});
