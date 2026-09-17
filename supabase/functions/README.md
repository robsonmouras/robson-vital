# Backend do quiz — Supabase Edge Functions

O site (`robsonvital.com.br`) é estático, publicado no GitHub Pages — não
roda Node/Express. Por isso o "backend" do quiz é feito só do pedaço que
realmente precisa de servidor (checar se o domínio do e-mail existe, gravar
o lead com validação forte, e consultar estatísticas), como Edge Functions do
próprio Supabase. Tudo o resto (perguntas, cálculo de qual resultado mostrar,
copy) continua no HTML estático em `public/quiz/index.html`.

## Functions

- **`quiz-submit`** — recebe respostas + dados de contato, valida (nome,
  e-mail com checagem de MX, WhatsApp, respostas do quiz), calcula o
  resultado, grava em `quiz_leads` e devolve a chave do resultado.
- **`quiz-validate-email`** — checagem rápida de e-mail (formato + MX),
  usada no blur do campo antes do envio final.
- **`quiz-stats`** — endpoint administrativo (exige header `x-admin-token`)
  com contagem de leads e distribuição por resultado / por `utm_content`.

A `quiz-submit` também dispara um alerta por e-mail a cada lead gravado,
chamando um Web App do Google Apps Script (`apps-script-quiz-alert.gs` na
raiz do repositório) — ver `enviarAlertaLead` em `_shared/quiz.ts`. Sem as
secrets `QUIZ_ALERT_WEBHOOK_URL`/`QUIZ_ALERT_WEBHOOK_SECRET` configuradas,
esse passo simplesmente não faz nada (não quebra o cadastro do lead).

## Deploy

Pré-requisito: [Supabase CLI](https://supabase.com/docs/guides/cli)
instalada e logada (`supabase login`), projeto já criado no dashboard e
linkado (`supabase link --project-ref SEU-PROJETO`).

```bash
# roda o SQL em supabase-quiz-leads.sql (SQL Editor do dashboard) antes disso

supabase functions deploy quiz-submit
supabase functions deploy quiz-validate-email
supabase functions deploy quiz-stats

# secret usado só pela quiz-stats (gere uma string aleatória qualquer)
supabase secrets set QUIZ_ADMIN_TOKEN=cole-uma-string-aleatoria-aqui

# opcional: restringe CORS a mais de uma origem (separadas por vírgula).
# sem isso, o padrão já é https://robsonvital.com.br
supabase secrets set CORS_ORIGIN=https://robsonvital.com.br,http://localhost:5173

# alerta por e-mail a cada lead novo (opcional — sem isso, quiz-submit
# funciona normal, só não manda e-mail). Deploy do Web App: veja o passo a
# passo no topo de apps-script-quiz-alert.gs, na raiz do repositório.
supabase secrets set QUIZ_ALERT_WEBHOOK_URL=https://script.google.com/macros/s/SEU-ID/exec
supabase secrets set QUIZ_ALERT_WEBHOOK_SECRET=a-mesma-string-que-voce-colocou-no-apps-script
```

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são injetadas automaticamente
pelo runtime das Edge Functions — não precisa configurar.

## Testando localmente

```bash
supabase functions serve quiz-submit --env-file .env.local
```

Com `.env.local` contendo pelo menos `SUPABASE_URL` e
`SUPABASE_SERVICE_ROLE_KEY` do projeto (pegue em Project Settings > API —
nunca comite esse arquivo, o `.gitignore` já ignora `.env*`).

## Chamando a partir do front-end

As duas URLs vivem em `public/quiz/index.html` (constantes `SUPABASE_URL` e
`SUPABASE_ANON_KEY`, mesmo lugar de antes). O front chama:

```
POST https://SEU-PROJETO.functions.supabase.co/quiz-submit
POST https://SEU-PROJETO.functions.supabase.co/quiz-validate-email
```

sempre com o header `Authorization: Bearer <SUPABASE_ANON_KEY>` — é só isso
que a chave anon faz agora (autenticar a chamada à function); ela não tem
mais permissão de escrever direto na tabela `quiz_leads` (ver
`supabase-quiz-leads.sql`).

## Limitações conhecidas (é o "leve" de propósito)

- **Rate limiting** é best-effort, por instância (memória do processo, sem
  Redis/KV compartilhado). Barra abuso básico, mas não é garantido sob
  múltiplas instâncias frias simultâneas.
- **Funil de abandono por pergunta e cliques totais** não estão em
  `quiz-stats` — já são cobertos pelos eventos `quiz_step_view` /
  `quiz_lead_enviado` no GTM/GA4 (ver comentário no topo do
  `public/quiz/index.html`), sem necessidade de duplicar em SQL.
- **Alerta por e-mail a cada lead** é enviado via Web App do Apps Script
  (ver acima) — não via um provedor de e-mail transacional dedicado. Cai na
  cota de envio do Gmail pessoal (bem acima do volume esperado aqui).
