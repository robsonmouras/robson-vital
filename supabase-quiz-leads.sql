-- Robson Vital — Leads do quiz "Como você quer que seu site te ajude?"
--
-- Como usar (projeto novo):
-- 1. Crie um projeto em https://supabase.com/dashboard (plano free serve).
-- 2. Menu "SQL Editor" > New query > cole este arquivo inteiro > Run.
-- 3. Deploy das Edge Functions em supabase/functions/ (veja o README lá).
--
-- Se você já tinha rodado a versão antiga deste script (sem as colunas de
-- UTM/flags abaixo), pode rodar este arquivo de novo — os comandos são
-- todos "IF NOT EXISTS" / idempotentes, não apagam dados existentes.

create table if not exists quiz_leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  whatsapp text not null,
  p1_objetivo text not null,
  p2_oferece text not null,
  p3_agendamento text,
  p4_conteudo text,
  resultado text not null,
  created_at timestamptz not null default now()
);

-- Tracking de origem (de onde veio o clique) e follow-up.
alter table quiz_leads add column if not exists utm_source text;
alter table quiz_leads add column if not exists utm_medium text;
alter table quiz_leads add column if not exists utm_campaign text;
alter table quiz_leads add column if not exists utm_content text;
alter table quiz_leads add column if not exists updated_at timestamptz not null default now();
alter table quiz_leads add column if not exists email_enviado boolean not null default false;
alter table quiz_leads add column if not exists whatsapp_enviado boolean not null default false;
alter table quiz_leads add column if not exists convertido boolean not null default false;

create index if not exists idx_quiz_leads_email on quiz_leads(email);
create index if not exists idx_quiz_leads_utm_content on quiz_leads(utm_content);
create index if not exists idx_quiz_leads_created_at on quiz_leads(created_at);

alter table quiz_leads enable row level security;

-- Gravação passou a ser feita só pela Edge Function "quiz-submit", que usa a
-- service_role key (ignora RLS) depois de validar tudo no servidor (MX check
-- de e-mail, formato de WhatsApp, dedupe). Por isso não existe mais policy
-- de insert pra role "anon": a chave anon embutida no HTML só serve pra
-- autenticar a chamada às Edge Functions, não pra escrever direto na tabela.
drop policy if exists "quiz_leads_insert_anon" on quiz_leads;

-- Consultar os leads é feito pelo painel do Supabase (Table Editor), pela
-- Edge Function "quiz-stats" (também com service_role) ou com a service_role
-- key diretamente — nunca pela chave anon.
