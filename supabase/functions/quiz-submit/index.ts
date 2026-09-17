// POST /functions/v1/quiz-submit
// Valida resposta do quiz + dados de contato, calcula o resultado, grava o
// lead no Supabase (com a service_role key, que ignora RLS) e devolve a
// chave do resultado pro front-end renderizar o conteúdo (copy vive só lá,
// pra não duplicar texto de marketing em dois lugares).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  calcularResultado,
  clientIp,
  corsHeaders,
  dominioRecebeEmail,
  jsonResponse,
  rateLimitOk,
  validarCampos,
} from '../_shared/quiz.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const DEDUPE_JANELA_MIN = 10;

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders(origin) });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Método não permitido.', code: 'METHOD_NOT_ALLOWED' }, 405, origin);
  }

  const ip = clientIp(req);
  if (!rateLimitOk(ip, 10, 60_000)) {
    return jsonResponse({ success: false, error: 'Muitas tentativas. Aguarde um minuto.', code: 'RATE_LIMITED' }, 429, origin);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (_err) {
    return jsonResponse({ success: false, error: 'JSON inválido.', code: 'BAD_REQUEST' }, 400, origin);
  }

  const { errors, payload } = validarCampos(body);
  if (!payload) {
    return jsonResponse({ success: false, errors }, 422, origin);
  }

  const dominioOk = await dominioRecebeEmail(payload.email);
  if (!dominioOk) {
    return jsonResponse(
      { success: false, errors: { email: 'Não encontramos esse domínio de e-mail. Confira se digitou certo.' } },
      422,
      origin,
    );
  }

  const resultado = calcularResultado(payload.p1, payload.p2, payload.p3, payload.p4);

  // Reenvio rápido do mesmo e-mail (double-click, retry de rede, bot) não
  // vira lead duplicado — devolve o lead já existente.
  const { data: existente } = await supabase
    .from('quiz_leads')
    .select('id, resultado')
    .eq('email', payload.email)
    .gte('created_at', new Date(Date.now() - DEDUPE_JANELA_MIN * 60_000).toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existente) {
    return jsonResponse({ success: true, lead_id: existente.id, resultado: existente.resultado }, 200, origin);
  }

  const { data: inserido, error } = await supabase
    .from('quiz_leads')
    .insert({
      nome: payload.nome,
      email: payload.email,
      whatsapp: payload.whatsapp,
      p1_objetivo: payload.p1,
      p2_oferece: payload.p2,
      p3_agendamento: payload.p3,
      p4_conteudo: payload.p4,
      resultado,
      utm_source: payload.utm_source ?? null,
      utm_medium: payload.utm_medium ?? null,
      utm_campaign: payload.utm_campaign ?? null,
      utm_content: payload.utm_content ?? null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('quiz-submit insert error', error.code, error.message);
    return jsonResponse({ success: false, error: 'Erro ao salvar seu resultado.', code: 'INTERNAL_ERROR' }, 500, origin);
  }

  return jsonResponse({ success: true, lead_id: inserido.id, resultado }, 201, origin);
});
