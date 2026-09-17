# Prompt: Quiz "Como você quer que seu site te ajude?"

## Contexto

Criar um quiz de captação de leads em `/quiz` no portfólio robsonvital.com.br.

O quiz educaciona o usuário sobre qual tipo de site faz sentido pro negócio dele, valida dados de contato e entrega um resultado personalizado. Funciona como ferramenta de vendas silenciosa, 24/7.

---

## Objetivo

1. Fazer 4-5 perguntas sobre objetivo, o que oferece, agendamento, conteúdo
2. Com base nas respostas, recomendar o tipo de site ideal
3. Capturar nome, email, WhatsApp
4. Armazenar lead + perfil no Supabase
5. Mostrar resultado personalizado

---

## Design System

**Cores:**
- Fundo: #F2F2F2
- Superfície (cards): #FFFFFF
- Texto: #464645
- CTA (botão Próximo, Enviar): #dc2626
- Bordas: #E5E5E5

**Tipografia:**
- Títulos: Outfit (300/400/600)
- Corpo: Inter (400/500)

**Vibe:**
- Muito espaço em branco
- Uma pergunta por vez, ocupando praticamente a tela
- Copy conversacional, não corporativo
- Indicador de progresso visual minimalista (01/05, 02/05, etc)
- Transições suaves entre perguntas (GSAP é opcional, mas bem-vindo)

---

## Estrutura do Quiz

### P1 — OBJETIVO
**Pergunta:** "O que você quer conquistar com seu site?"

Opções:
- A: Vender algo direto (produto, curso, serviço)
- B: Atrair clientes / gerar leads
- C: Mostrar meu trabalho / credibilidade
- D: Compartilhar conhecimento / conteúdo

### P2 — O QUE OFERECE
**Pergunta:** "Qual melhor descreve o que você faz?"

Opções:
- A: Serviço (consultoria, consultório, agência, etc)
- B: Produto físico
- C: Produto digital ou curso
- D: Meu portfólio / trabalhos

### P3 — AGENDAMENTO
**Pergunta:** "Seus clientes precisam marcar horário com você?"

Opções:
- A: Sim, preciso de agendamento
- B: Não preciso

### P4 — CONTEÚDO
**Pergunta:** "Você compartilha dicas, conselhos ou conhecimento com seus clientes?"

Opções:
- A: Sim, quero aparecer no Google com conteúdo
- B: Não, só o essencial

---

## Lógica de Recomendação

| P1 | P2 | P3 | P4 | Resultado |
|----|----|----|----|-----------|
| A (Vender) | B (Físico) | - | - | **Ecommerce** |
| A (Vender) | C (Digital/Curso) | - | A | **Venda de Curso** |
| A (Vender) | C (Digital/Curso) | - | B | **Landing Page** |
| A (Vender) | A (Serviço) | - | - | **Landing Page** |
| B (Leads) | A (Serviço) | A | - | **Site para Serviços + Calendly** |
| B (Leads) | A (Serviço) | B | - | **Lead Magnet** |
| B (Leads) | B ou C | - | A | **Lead Magnet + Blog** |
| B (Leads) | B ou C | - | B | **Landing Page** |
| C (Credibilidade) | D (Portfólio) | - | A | **Portfolio/Showroom + Blog** |
| C (Credibilidade) | D (Portfólio) | - | B | **Portfolio/Showroom** |
| C (Credibilidade) | A (Serviço) | - | A | **Site Institucional + Blog** |
| C (Credibilidade) | A (Serviço) | - | B | **Site Institucional** |
| D (Conhecimento) | - | - | A | **Blog** |

---

## Fluxo de Dados

1. **P1-P4:** Usuário responde as 4 perguntas (navegação por botões, não radio/checkbox)
2. **Formulário:** Após P4, apareça a tela de captura
   - Copy: "Agora a gente precisa se conhecer melhor."
   - Campos: Nome (obrigatório, mín 3 chars), Email (obrigatório, validar MX), WhatsApp (obrigatório, 11 dígitos)
   - Botão: "Descobrir meu site ideal" (#dc2626)
3. **Validação:**
   - Email: regex + MX check (backend)
   - WhatsApp: apenas números, 11 dígitos
   - Mostrar erro inline se falhar
4. **Resultado:** Após formulário ser enviado, mostrar resultado personalizado
   - Armazenar no Supabase: respostas P1-P4 + nome + email + WhatsApp + timestamp
   - Exibir copy do resultado + CTA pro WhatsApp do Robson (41987513229)

---

## Copy dos Resultados

### 01. Ecommerce
"Você precisa de um **Ecommerce**.

Seu objetivo é vender produtos direto. Você vai precisar de:
- Catálogo estruturado
- Carrinho de compras
- Integração de pagamento
- Gestão de estoque

Vamos montar algo que converte visitante em cliente."

### 02. Venda de Curso
"Você precisa de um **Site para Venda de Curso**.

Você quer vender conhecimento. Você vai precisar de:
- Página de apresentação do curso
- Sistema de login para alunos
- Biblioteca de conteúdo
- Email marketing integrado

Vamos estruturar isso tudo pra você."

### 03. Landing Page
"Você precisa de uma **Landing Page**.

Seu foco é converter visitantes em clientes rápido. Você vai precisar de:
- Headline que chama atenção
- Benefícios claros
- CTA irresistível
- Formulário de contato

Vamos criar algo que vende."

### 04. Site para Serviços + Calendly
"Você precisa de um **Site para Apresentar Serviços** com agendamento integrado.

Seus clientes precisam marcar horário. Você vai precisar de:
- Apresentação clara dos serviços
- Calendly ou sistema de agendamento integrado
- Portfolio de clientes
- Depoimentos

Vamos facilitar a vida dos seus clientes."

### 05. Lead Magnet
"Você precisa de um **Lead Magnet**.

Seu objetivo é captar contatos interessados. Você vai precisar de:
- Oferta de valor (guia, checklist, etc)
- Formulário estratégico
- Email de boas-vindas
- Follow-up automático

Vamos construir um ímã de leads."

### 06. Lead Magnet + Blog
"Você precisa de um **Lead Magnet com Blog integrado**.

Você quer captar leads através de conteúdo. Você vai precisar de:
- Artigos que resolvem problemas
- Lead magnet no final de cada post
- Email marketing
- SEO básico

Vamos gerar tráfego e leads ao mesmo tempo."

### 07. Portfolio/Showroom
"Você precisa de um **Portfolio** (ou Showroom).

Seu objetivo é mostrar seu trabalho. Você vai precisar de:
- Galeria de projetos
- Case studies ou descrições
- Contato direto
- Filtros por categoria

Vamos deixar seu trabalho brilhar."

### 08. Portfolio/Showroom + Blog
"Você precisa de um **Portfolio com Blog**.

Você quer mostrar trabalho e aparecer no Google. Você vai precisar de:
- Galeria de projetos
- Artigos sobre seu expertise
- SEO otimizado
- Email para contato

Vamos trazer clientes via busca orgânica."

### 09. Site Institucional
"Você precisa de um **Site Institucional**.

Seu objetivo é mostrar credibilidade e profissionalismo. Você vai precisar de:
- Apresentação da empresa
- Time e valores
- Serviços estruturados
- Contato claro

Vamos construir a sua presença online sólida."

### 10. Site Institucional + Blog
"Você precisa de um **Site Institucional com Blog**.

Você quer credibilidade e aparecer no Google. Você vai precisar de:
- Site institucional robusto
- Artigos de relevância
- SEO estratégico
- Inteligência em conteúdo

Vamos fazer você ser encontrado."

### 11. Blog
"Você precisa de um **Blog** (ou Hub de Conteúdo).

Seu foco é compartilhar conhecimento e educar. Você vai precisar de:
- Estrutura de artigos
- SEO e categorização
- Newsletter integrada
- Comunidade

Vamos transformar seus conhecimentos em autoridade."

---

## CTA Final

Depois do resultado:

"Vamos converter isso em realidade?

[CONVERSAR NO WHATSAPP]"

Link: `https://wa.me/5541987513229?text=Olá%20Robson!%20Acabei%20de%20fazer%20o%20quiz%20e%20descobri%20que%20preciso%20de%20um%20[TIPO%20DE%20SITE].%20Podemos%20conversar?`

---

## Requisitos Técnicos

**Stack recomendada:**
- React (ou Vue/Svelte)
- Tailwind CSS (ou sistema de estilo próprio)
- Supabase (banco de dados)
- GSAP (animações, opcional mas bem-vindo)

**Endpoints necessários:**
- POST `/api/quiz/lead` — salvar lead + respostas
- POST `/api/quiz/validate-email` — validar email (MX check)

**Armazenamento (Supabase):**

Tabela: `quiz_leads`
- id (uuid, pk)
- nome (text)
- email (text)
- whatsapp (text)
- p1_objetivo (text)
- p2_oferece (text)
- p3_agendamento (text)
- p4_conteudo (text)
- resultado (text)
- created_at (timestamp)

---

## Comportamento Esperado

- **Responsive:** Mobile-first, testar em celular
- **Performance:** Carregar rápido, sem JS desnecessário
- **UX:** Sem saltar de página, tudo fluid
- **Armazenamento:** Lead persistido antes de mostrar resultado
- **Compartilhamento:** Resultado único por email/WhatsApp (não permitir duplicate leads mesma sessão)
- **Fallback:** Se email não validar, mostrar mensagem clara e deixar usuário corrigir

---

## Copy Transição (todas respostas)

Após P4:

"Seu site ideal está tomando forma.

A gente identificou exatamente o que faz sentido pro seu negócio.

Agora a gente precisa se conhecer melhor."

---

## Métricas Importantes

Rastrear:
- Taxa de conclusão por pergunta (onde as pessoas abandonam?)
- Distribuição de tipos de site (qual é o mais comum?)
- Taxa de conversão (leads gerados vs. cliques iniciais)
- Tempo médio no quiz

---

## Próximos Passos (V2)

- Recomendações automáticas de features (Calendly, Blog, etc)
- A/B testing de copy/perguntas
- Integração com email (enviar resultado por email)
- Rastreamento de UTM (saber de onde vem o tráfego)
- Gamificação/progress bar animada

---

## Notas Importantes

1. O quiz é uma ferramenta de vendas, não um formulário corporativo
2. Foco em educação + captura, não em venda agressiva
3. Copy sempre conversacional, como se Robson estivesse falando
4. O resultado é uma recompensa pela conversão
5. Dados armazenados permitem follow-up estratégico
