# robson-vital

Portfólio de Robson Moura — site estático publicado no GitHub Pages.

## CSS (Tailwind)

O CSS é **pré-compilado**. O site não usa mais o `cdn.tailwindcss.com`, que baixava
124 KiB de JavaScript bloqueante para gerar as classes dentro do navegador.

Sempre que você **adicionar ou remover uma classe Tailwind** em `index.html`,
`briefing.html`, `js/*.js` ou `translations.js`, é preciso regerar o `css/tailwind.css`:

```bash
npm install       # só na primeira vez
npm run build:css
```

Durante o desenvolvimento, `npm run watch:css` recompila a cada alteração.

O arquivo gerado (`css/tailwind.css`) é versionado no Git, porque o GitHub Pages
publica o repositório como está, sem etapa de build.

## Estrutura

| Caminho             | O que é                                                        |
| ------------------- | -------------------------------------------------------------- |
| `index.html`        | Página única, com o CSS específico do site em um `<style>`      |
| `briefing.html`     | Formulário de briefing de identidade visual (`noindex`)         |
| `js/main.js`        | Animações (GSAP), modal de projetos, menu mobile, navegação     |
| `js/briefing.js`    | Etapas, rascunho local, Turnstile e envio do briefing            |
| `apps-script/`      | Back-end do briefing (Google Apps Script) — veja o README de lá  |
| `translations.js`   | Dicionário PT/EN aplicado via atributos `data-i18n`             |
| `src/tailwind.css`  | Entrada do Tailwind (não editar o CSS gerado em `css/`)         |
| `fonts/`            | Inter (woff2) servida pelo próprio domínio                      |

O `briefing.html` não entra no menu nem no `sitemap.xml`: o link é enviado direto
ao cliente. Antes de usar, preencha as duas chaves no topo de `js/briefing.js`
seguindo [`apps-script/README.md`](apps-script/README.md).

## Fontes

A Inter é auto-hospedada em `fonts/` em vez de vir do Google Fonts, o que remove
uma requisição de CSS de terceiros mais o download da fonte do caminho crítico.
São os arquivos variáveis (pesos 400–600): `inter-latin.woff2` cobre o português;
`inter-latin-ext.woff2` só é baixado se a página precisar de algum caractere fora
do subconjunto latino básico.

## Imagens

`img/perfil.webp` é servida com `srcset` em três larguras (640/900/1200). Se a foto
for trocada, gere as variantes de novo:

```bash
ffmpeg -i img/perfil.webp -vf "scale=640:-2:flags=lanczos" -c:v libwebp -quality 78 img/perfil-640.webp
ffmpeg -i img/perfil.webp -vf "scale=900:-2:flags=lanczos" -c:v libwebp -quality 78 img/perfil-900.webp
```

Os logos em `img/logos/` têm `width`/`height` explícitos no HTML — mantenha esses
valores em sincronia com o arquivo, senão volta a haver deslocamento de layout (CLS).
