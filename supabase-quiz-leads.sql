-- Robson Vital — Leads do quiz "Como você quer que seu site te ajude?"
--
-- Como usar:
-- 1. Crie um projeto em https://supabase.com/dashboard (plano free serve).
-- 2. Menu "SQL Editor" > New query > cole este arquivo inteiro > Run.
-- 3. Menu "Project Settings" > "API": copie a "Project URL" e a chave
--    "anon public" (NUNCA a "service_role", essa é secreta).
-- 4. Cole os dois valores em public/quiz/index.html, nas constantes
--    SUPABASE_URL e SUPABASE_ANON_KEY (procure por "COLE AQUI").

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

alter table quiz_leads enable row level security;

-- A chave "anon" (pública, embutida no HTML) só pode INSERIR linhas —
-- não consegue ler, editar ou apagar nada. Consultar os leads é feito só
-- pelo painel do Supabase (Table Editor) ou com a service_role key.
drop policy if exists "quiz_leads_insert_anon" on quiz_leads;
create policy "quiz_leads_insert_anon" on quiz_leads
  for insert
  to anon
  with check (true);
