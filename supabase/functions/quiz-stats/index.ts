// GET /functions/v1/quiz-stats
// Endpoint administrativo: exige o header x-admin-token igual ao secret
// QUIZ_ADMIN_TOKEN. Não é pra ser chamado pelo navegador público — use
// curl/Postman ou um painel interno.
//
// Taxa de conclusão por pergunta e cliques totais já são cobertos pelos
// eventos quiz_step_view / quiz_lead_enviado no GTM/GA4 (ver comentário no
// topo de public/quiz/index.html) — não duplicado aqui.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/quiz.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders(origin) });
  }

  const adminToken = Deno.env.get('QUIZ_ADMIN_TOKEN');
  if (!adminToken || req.headers.get('x-admin-token') !== adminToken) {
    return jsonResponse({ success: false, error: 'Não autorizado.', code: 'UNAUTHORIZED' }, 401, origin);
  }

  if (req.method !== 'GET') {
    return jsonResponse({ success: false, error: 'Método não permitido.', code: 'METHOD_NOT_ALLOWED' }, 405, origin);
  }

  const url = new URL(req.url);
  const utmContent = url.searchParams.get('utm_content');
  const dateFrom = url.searchParams.get('date_from');
  const dateTo = url.searchParams.get('date_to');

  let query = supabase.from('quiz_leads').select('resultado, utm_content, created_at');
  if (utmContent) query = query.eq('utm_content', utmContent);
  if (dateFrom) query = query.gte('created_at', dateFrom);
  if (dateTo) query = query.lte('created_at', dateTo);

  const { data, error } = await query;

  if (error) {
    console.error('quiz-stats query error', error.code, error.message);
    return jsonResponse({ success: false, error: 'Erro ao consultar estatísticas.', code: 'INTERNAL_ERROR' }, 500, origin);
  }

  const resultadoDistribuicao: Record<string, number> = {};
  const porAmigoMap = new Map<string, number>();

  for (const row of data) {
    resultadoDistribuicao[row.resultado] = (resultadoDistribuicao[row.resultado] ?? 0) + 1;
    if (row.utm_content) {
      porAmigoMap.set(row.utm_content, (porAmigoMap.get(row.utm_content) ?? 0) + 1);
    }
  }

  const porAmigo = Array.from(porAmigoMap.entries())
    .map(([utm_content, leads]) => ({ utm_content, leads }))
    .sort((a, b) => b.leads - a.leads);

  return jsonResponse(
    {
      success: true,
      total_leads: data.length,
      resultado_distribuicao: resultadoDistribuicao,
      por_amigo: porAmigo,
    },
    200,
    origin,
  );
});
