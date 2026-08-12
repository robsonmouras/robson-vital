import { defineConfig } from 'vite';

// Remove os comentários HTML (<!-- ... -->) do index.html só no build de
// produção. Vite minifica JS/CSS por padrão (esbuild), mas não toca no
// HTML — sem isso, os comentários explicativos do src/index.html (docs de
// layout, GTM, etc.) iriam parar no dist/ e, portanto, no site publicado.
function stripHtmlComments() {
  return {
    name: 'strip-html-comments',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(/<!--[\s\S]*?-->/g, '');
    },
  };
}

// Publicado em https://robsonvital.com.br/ via domínio customizado (CNAME em
// public/) apontado pro GitHub Pages. O site fica na raiz do domínio, não
// numa subpasta — por isso base "/" tanto no dev quanto no build (ver
// %BASE_URL% em index.html e import.meta.env.BASE_URL em src/projects.js).
//
// Antes disso o site vivia em https://robsonmouras.github.io/robson-vital/
// (GitHub Pages de projeto, subpasta) e o build usava base "/robson-vital/".
// O GitHub já redireciona essa URL antiga pro domínio novo automaticamente.
export default defineConfig({
  base: '/',
  plugins: [stripHtmlComments()],
});
