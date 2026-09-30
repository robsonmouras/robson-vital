import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { PROJECT_SEO } from './src/content/project-seo.js';

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

// URL própria por projeto: /projetos/<slug>/ (PT) e /en/projects/<slug>/
// (EN). No build, cada uma vira uma cópia da home do idioma com título,
// descrição, canonical e imagem de compartilhamento do case (ver
// src/content/project-seo.js) — é isso que WhatsApp/LinkedIn leem pro
// preview, já que não rodam JS. Ao abrir, o JS (src/projects.js) lê o slug
// da URL e abre o overlay do case em cima da home.
const SITE = 'https://robsonvital.com.br/';
const PROJECT_PATHS = { pt: 'projetos/', en: 'en/projects/' };

const escapeAttr = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function setMeta(html, attr, name, content) {
  const re = new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")[^"]*(")`);
  return html.replace(re, (_m, a, b) => a + escapeAttr(content) + b);
}

function buildProjectPage(html, lang, slug, seo) {
  const meta = seo[lang];
  const url = SITE + PROJECT_PATHS[lang] + slug + '/';
  const image = SITE + seo.image;
  const ptUrl = SITE + PROJECT_PATHS.pt + slug + '/';
  const enUrl = SITE + PROJECT_PATHS.en + slug + '/';

  let out = html
    .replace(/<title>[^<]*<\/title>/, () => '<title>' + meta.title + '</title>')
    .replace(/(<link rel="canonical" href=")[^"]*(")/, '$1' + url + '$2')
    .replace(/(<link rel="alternate" hreflang="pt-BR" href=")[^"]*(")/, '$1' + ptUrl + '$2')
    .replace(/(<link rel="alternate" hreflang="en" href=")[^"]*(")/, '$1' + enUrl + '$2')
    .replace(/(<link rel="alternate" hreflang="x-default" href=")[^"]*(")/, '$1' + ptUrl + '$2')
    // A imagem do case não tem as dimensões do og-image padrão (1200x630).
    .replace(/<meta property="og:image:(width|height)" content="[^"]*" ?\/?>\s*/g, '');

  out = setMeta(out, 'name', 'description', meta.description);
  out = setMeta(out, 'property', 'og:url', url);
  out = setMeta(out, 'property', 'og:title', meta.title);
  out = setMeta(out, 'property', 'og:description', meta.description);
  out = setMeta(out, 'property', 'og:image', image);
  out = setMeta(out, 'name', 'twitter:title', meta.title);
  out = setMeta(out, 'name', 'twitter:description', meta.description);
  out = setMeta(out, 'name', 'twitter:image', image);
  return out;
}

function projectPages() {
  const urlPattern = /^\/(?:(en)\/projects|projetos)\/([^/]+)\/?$/;
  return {
    name: 'project-pages',
    enforce: 'post',

    // Build: gera uma página por projeto e idioma a partir do HTML final da
    // home (já com os assets com hash).
    generateBundle(_options, bundle) {
      const homes = { pt: bundle['index.html'], en: bundle['en/index.html'] };
      for (const lang of ['pt', 'en']) {
        const home = homes[lang];
        if (!home) continue;
        for (const [slug, seo] of Object.entries(PROJECT_SEO)) {
          this.emitFile({
            type: 'asset',
            fileName: PROJECT_PATHS[lang] + slug + '/index.html',
            source: buildProjectPage(String(home.source), lang, slug, seo),
          });
        }
      }
    },

    // Dev: a URL do projeto cai na home do idioma certo (em produção é a
    // página gerada acima).
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const match = req.url && urlPattern.exec(req.url.split('?')[0]);
        if (match && PROJECT_SEO[decodeURIComponent(match[2])]) {
          req.url = match[1] ? '/en/index.html' : '/index.html';
        }
        next();
      });
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
  plugins: [stripHtmlComments(), projectPages(), serveDirIndex()],
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
