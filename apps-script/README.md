# Back-end do briefing

O formulário em [`/briefing.html`](../briefing.html) envia as respostas para um
Web App do Google Apps Script, que grava tudo numa planilha do Drive. O código do
Web App é o [`briefing.gs`](briefing.gs) — este arquivo não roda no site, ele é
colado no editor do Apps Script. A cópia fica aqui para o back-end não existir
só dentro do Google.

Ordem de configuração: **planilha → Apps Script → Turnstile → chaves no site**.

## 1. Planilha

1. Crie uma planilha nova no Google Drive (ex.: `Briefings — Identidade Visual`).
2. Não precisa criar aba nem cabeçalho: o script cria a aba `Resumo` no primeiro
   envio e, a cada briefing, uma aba nova com o nome da empresa.

## 2. Apps Script

1. Na planilha: **Extensões › Apps Script**.
2. Apague o conteúdo do `Código.gs` e cole o [`briefing.gs`](briefing.gs) inteiro.
3. **Configurações do projeto › Propriedades do script**, adicione:

   | Propriedade        | Valor                                                       |
   | ------------------ | ----------------------------------------------------------- |
   | `TURNSTILE_SECRET` | secret key do widget (passo 3) — **obrigatória**             |
   | `NOTIFY_EMAIL`     | e-mail que recebe aviso de briefing novo — opcional          |
   | `SPREADSHEET_ID`   | só se o script não for criado a partir da planilha           |

4. **Implantar › Nova implantação › Web app**, com:
   - *Executar como*: **Eu**
   - *Quem pode acessar*: **Qualquer pessoa**
5. Autorize o acesso (a tela de "app não verificado" é esperada — é o seu próprio
   script; siga em *Avançado › Acessar projeto*).
6. Copie a **URL da implantação** (`.../exec`).

> Toda alteração no código só vale depois de **Implantar › Gerenciar implantações
> › Editar › Nova versão**. Salvar o arquivo não republica.

## 3. Cloudflare Turnstile

1. Painel da Cloudflare › **Turnstile › Add widget**.
2. Hostnames: o domínio de produção (`robsonmouras.github.io`) e `localhost` para testes.
3. Modo **Managed**.
4. Guarde a **site key** (pública) e a **secret key** (vai na propriedade do passo 2.3).

## 4. Ligar o site

No topo de [`../js/briefing.js`](../js/briefing.js), substitua:

```js
const ENDPOINT = 'COLE_AQUI_A_URL_DO_APPS_SCRIPT';
const TURNSTILE_SITE_KEY = 'COLE_AQUI_A_SITE_KEY_DO_TURNSTILE';
```

Enquanto esses valores forem os placeholders, a página funciona normalmente para
testar o layout: o Turnstile não é carregado e o envio avisa o que falta.

## Como fica a planilha

- **`Resumo`** — uma linha por briefing: data, empresa, nome, e-mail, WhatsApp,
  entregáveis, prazo e um link `Abrir aba`.
- **Uma aba por cliente**, nomeada com o nome da empresa, com as respostas em duas
  colunas (pergunta / resposta) separadas pelos títulos das seções.

Os rótulos das perguntas vêm da constante `SECTIONS` dentro do `briefing.gs`, e não
do navegador — o que é gravado não depende do que o cliente mandar na requisição.
**Ao adicionar ou remover um campo no formulário, atualize `SECTIONS` também**,
senão a resposta chega mas não aparece na aba.

## Proteções

| Camada             | O que faz                                                              |
| ------------------ | ---------------------------------------------------------------------- |
| Campo-armadilha    | Invisível na tela; se vier preenchido, o envio é descartado em silêncio |
| Tempo mínimo       | Envio com menos de 8 segundos de preenchimento é descartado             |
| Turnstile          | Token validado no `siteverify` antes de qualquer escrita                |
| `LockService`      | Impede que dois envios simultâneos criem a mesma aba duas vezes         |

Sem `TURNSTILE_SECRET` configurada o script recusa todos os envios de propósito:
a URL do Web App é pública, então liberar sem verificação seria o mesmo que não
ter proteção nenhuma.
