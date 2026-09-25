import { resolve } from 'node:path';
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

// Páginas estáticas extras que vivem em public/ como <pasta>/index.html
// (ex.: o case /projetos/moodboard-studio/). Em produção o GitHub Pages
// serve o index.html do diretório automaticamente; o `vite preview` também.
// Só o `vite dev` não faz isso — a URL de diretório cai no fallback de SPA
// e devolve o index.html da raiz. Este middleware reescreve a URL de
// diretório pro index.html correspondente só no dev, pra igualar produção.
function serveDirIndex() {
  return {
    name: 'serve-public-dir-index',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url && req.url.endsWith('/') && req.url !== '/') {
          req.url = req.url + 'index.html';
        }
        next();
      });
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
  plugins: [stripHtmlComments(), serveDirIndex()],
  // Duas páginas: português em / e inglês em /en/ (ver <html lang> em cada
  // uma e src/i18n.js). O idioma inicial é escolhido no navegador por um
  // script inline no <head> — o GitHub Pages é estático, sem negociação
  // de idioma no servidor.
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        en: resolve(import.meta.dirname, 'en/index.html'),
      },
    },
  },
});
