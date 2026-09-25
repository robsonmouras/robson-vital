import { gsap } from 'gsap';
import { LANG, t } from './i18n.js';
import { PROJECT_CONTENT as PROJECT_CONTENT_PT } from './content/projects.pt.js';
import { PROJECT_CONTENT as PROJECT_CONTENT_EN } from './content/projects.en.js';

// Conteúdo dos cases no idioma da página (ver src/content e src/i18n.js).
const PROJECT_CONTENT = LANG === 'en' ? PROJECT_CONTENT_EN : PROJECT_CONTENT_PT;

/**
 * Seção Projetos: grid de logos com popover que segue o cursor, e
 * overlay de projeto em tela cheia. A cabeça permanece inteira (sem
 * corte) em todas as seções — ver hero.js, que só cuida do dock na
 * lateral esquerda.
 */
export function initProjects({ lenis }) {
  const section = document.getElementById('projects');
  if (!section) return;

  initTilePopovers();
  initOverlay({ lenis });
}

/**
 * Popover que acompanha o cursor dentro do retângulo de cada tile.
 * `xPercent`/`yPercent` são fixados uma vez (centraliza o balão sobre o
 * ponteiro) e só o x/y em px é animado depois — mesma técnica do nome
 * no hero.js, pra não brigar com o transform de centralização.
 */
function initTilePopovers() {
  const tiles = document.querySelectorAll('.project-tile');

  tiles.forEach((tile) => {
    const popover = tile.querySelector('.project-tile__popover');
    const logo = tile.querySelector('.project-tile__logo');
    if (!popover) return;

    gsap.set(popover, { xPercent: -50, yPercent: -100 });
    const setX = gsap.quickTo(popover, 'x', { duration: 0.35, ease: 'power3' });
    const setY = gsap.quickTo(popover, 'y', { duration: 0.35, ease: 'power3' });

    // Fallback: se o arquivo do logo não carregar (placeholder ainda não
    // substituído por um arquivo real), mostra o nome da empresa no
    // lugar da imagem em vez de deixar um ícone de imagem quebrada.
    if (logo) {
      logo.addEventListener(
        'error',
        () => tile.classList.add('project-tile--broken'),
        { once: true }
      );
    }

    function move(event) {
      const rect = tile.getBoundingClientRect();
      const popRect = popover.getBoundingClientRect();
      const halfW = popRect.width / 2 || 40;
      const popH = popRect.height || 30;
      const gap = 14; // respiro entre o popover e a borda do tile

      const minX = halfW + gap;
      const maxX = Math.max(minX, rect.width - halfW - gap);
      const minY = popH + gap;
      const maxY = Math.max(minY, rect.height - gap);

      const x = clamp(event.clientX - rect.left, minX, maxX);
      const y = clamp(event.clientY - rect.top, minY, maxY);

      setX(x);
      setY(y);
    }

    tile.addEventListener('pointerenter', (event) => {
      gsap.to(popover, { opacity: 1, duration: 0.2 });
      move(event);
    });
    tile.addEventListener('pointermove', move);
    tile.addEventListener('pointerleave', () => {
      gsap.to(popover, { opacity: 0, duration: 0.2 });
    });
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Overlay de projeto em tela cheia (ver estrutura em index.html).
 * Popula nome/serviço a partir do tile clicado, monta o case study
 * (imagem + texto) via renderProjectBody/PROJECT_CONTENT, e cuida de
 * abrir/fechar com foco e scroll travados.
 */
function initOverlay({ lenis }) {
  const overlay = document.getElementById('projectOverlay');
  const closeBtn = document.getElementById('projectOverlayClose');
  const scroller = document.getElementById('projectOverlayScroll');
  const tiles = document.querySelectorAll('.project-tile');
  if (!overlay || !closeBtn) return;

  const nameField = overlay.querySelector('[data-field="name"]');
  const visitRowField = overlay.querySelector('[data-visit-row]');
  const serviceField = overlay.querySelector('[data-field="service"]');
  const mediaField = overlay.querySelector('[data-project-media]');
  const bodyField = overlay.querySelector('[data-project-body]');
  const moreField = overlay.querySelector('[data-project-more]');
  const placeholderNote = overlay.querySelector('[data-placeholder-note]');

  let lastFocused = null;
  let currentSlug = null;
  // true só quando empilhamos uma entrada nossa no histórico (pushState) —
  // aí `close()` pode dar `history.back()` com segurança. Troca de projeto
  // pelos cards "Veja outros projetos" usa replaceState e não mexe nisto,
  // então voltar continua fechando o overlay direto, sem reabrir o case
  // anterior "por cima".
  let pushedHistoryEntry = false;

  /**
   * URL própria por projeto, pra rastrear no GTM/Analytics qual case é
   * mais visto e permitir link direto. Usa hash (`#/projetos/<slug>`) em
   * vez de caminho real porque o site é estático no GitHub Pages — hash
   * não precisa de fallback de servidor e não corre risco de SEO.
   * Slug = `data-slug` do tile (ver index.html).
   */
  const PROJECT_HASH_PREFIX = '#/projetos/';
  const slugToTile = new Map();
  tiles.forEach((tile) => {
    if (tile.dataset.slug) slugToTile.set(tile.dataset.slug, tile);
  });

  function slugFromHash() {
    const hash = window.location.hash;
    return hash.startsWith(PROJECT_HASH_PREFIX)
      ? decodeURIComponent(hash.slice(PROJECT_HASH_PREFIX.length))
      : null;
  }

  // `syncUrl: false` quando a abertura veio da própria URL (deep link ou
  // botão voltar/avançar) — aí o histórico já está no estado certo e não
  // se deve empilhar outra entrada.
  // `replaceUrl: true` quando a troca partiu de dentro do próprio overlay
  // (cards "Veja outros projetos") — substitui a entrada atual em vez de
  // empilhar, pra não abrir um case "por cima" do outro: voltar fecha o
  // overlay direto, sem passar pelo projeto anterior.
  function open(tile, { syncUrl = true, replaceUrl = false } = {}) {
    const slug = tile.dataset.slug || null;

    if (nameField) nameField.textContent = tile.dataset.name || '';
    if (serviceField) serviceField.textContent = tile.dataset.service || '';
    renderProjectBody(tile.dataset.name);
    renderMoreProjects(slug);
    if (scroller) {
      scroller.scrollTop = 0;
      scroller.classList.remove('is-scrolled');
    }

    if (!overlay.classList.contains('is-open')) {
      lastFocused = document.activeElement;
    }
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.body.classList.add('has-overlay');
    lenis?.stop();
    closeBtn.focus();

    currentSlug = slug;

    if (slug && syncUrl) {
      if (replaceUrl) {
        window.history.replaceState(
          { project: slug },
          '',
          PROJECT_HASH_PREFIX + slug
        );
      } else {
        window.history.pushState(
          { project: slug },
          '',
          PROJECT_HASH_PREFIX + slug
        );
        pushedHistoryEntry = true;
      }
    }

    if (slug) {
      // Evento explícito pro GTM/GA4 — mais confiável do que depender do
      // gatilho de History Change pra medir visualização de cada case.
      window.dataLayer?.push({
        event: 'view_project',
        project_name: tile.dataset.name || '',
        project_slug: slug,
      });
    }
  }

  /**
   * Monta imagem + texto do case study a partir de PROJECT_CONTENT.
   * A imagem vai pro slot `mediaField` (fora de `.project-overlay__inner`,
   * pra ocupar a largura cheia — ver style.css); nome/serviço (markup
   * estático) ficam logo abaixo dela; tags/textos vão pro `bodyField`.
   * Sem entrada pro projeto: limpa tudo e deixa só o aviso placeholder
   * visível (ver .project-overlay__placeholder-note).
   */
  function renderProjectBody(projectName) {
    if (!bodyField) return;
    bodyField.innerHTML = '';
    if (mediaField) mediaField.innerHTML = '';
    if (visitRowField) visitRowField.innerHTML = '';

    const content = PROJECT_CONTENT[projectName];
    if (!content) {
      if (placeholderNote) placeholderNote.hidden = false;
      return;
    }
    if (placeholderNote) placeholderNote.hidden = true;

    if (content.media && mediaField) {
      const picture = document.createElement('picture');
      if (content.media.src.endsWith('.webp') && content.media.fallback) {
        const source = document.createElement('source');
        source.srcset = content.media.src;
        source.type = 'image/webp';
        picture.appendChild(source);
      }

      const img = document.createElement('img');
      img.src = content.media.fallback || content.media.src;
      img.alt = content.media.alt || '';
      if (content.media.width) img.width = content.media.width;
      if (content.media.height) img.height = content.media.height;
      img.loading = 'lazy';
      img.decoding = 'async';
      picture.appendChild(img);

      mediaField.appendChild(picture);

      // Seta animada sobre a imagem de capa, avisando que dá pra rolar
      // pra ver o case study. Some assim que o usuário rola
      // (ver .is-scrolled em initOverlay e .project-overlay__scroll-hint
      // no CSS).
      const scrollHint = document.createElement('div');
      scrollHint.className = 'project-overlay__scroll-hint';
      scrollHint.setAttribute('aria-hidden', 'true');
      scrollHint.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>';
      mediaField.appendChild(scrollHint);
    }

    // Botão "ver site no ar" logo abaixo do título (ver .project-overlay__visit-row).
    // Só aparece pra quem tem `url` no PROJECT_CONTENT (limpo no topo
    // desta função a cada render).
    if (content.url && visitRowField) {
      const link = document.createElement('a');
      link.className = 'project-overlay__visit-cta';
      link.href = content.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></svg><span>' + t.visitProject + '</span>';
      visitRowField.appendChild(link);
    }

    if (content.tags?.length) {
      const tagList = document.createElement('div');
      tagList.className = 'project-overlay__tags';
      content.tags.forEach((tag) => {
        const span = document.createElement('span');
        span.className = 'project-overlay__tag';
        span.textContent = tag;
        tagList.appendChild(span);
      });
      bodyField.appendChild(tagList);
    }

    content.sections?.forEach((section) => {
      // Imagem intercalada no meio do texto (não confundir com
      // `content.media`, a única imagem "de capa" no topo do overlay).
      if (section.type === 'image') {
        bodyField.appendChild(buildInlineImage(section));
        return;
      }

      // Citação de cliente/stakeholder sobre o trabalho.
      if (section.type === 'quote') {
        bodyField.appendChild(buildQuote(section));
        return;
      }

      // Números de resultado em destaque (ver PROJECT_CONTENT, `sections`
      // com `type: 'stats'`) — usado pra dar peso visual a métricas de
      // impacto em vez de deixá-las perdidas no meio do parágrafo.
      if (section.type === 'stats') {
        bodyField.appendChild(buildStats(section));
        return;
      }

      const wrap = document.createElement('div');
      wrap.className = 'project-overlay__section';

      // `heading` é opcional — permite emendar um parágrafo de
      // continuação (ex.: logo antes/depois de um bloco de `stats`) sem
      // repetir o título da seção anterior.
      if (section.heading) {
        const heading = document.createElement('h3');
        heading.className = 'project-overlay__section-heading';
        heading.textContent = section.heading;
        wrap.appendChild(heading);
      }

      const text = document.createElement('p');
      text.className = 'project-overlay__section-text';
      text.textContent = section.text;

      wrap.appendChild(text);
      bodyField.appendChild(wrap);
    });

    // Selo do parceiro por último, fechando o case study.
    if (content.partner) {
      bodyField.appendChild(buildPartnerNote(content.partner));
    }
  }

  /**
   * "Veja outros projetos" no fim do case study: até 3 projetos
   * sorteados, fora o que está aberto e os marcados como "em andamento"
   * (ainda sem case pra mostrar). Clicar num card abre aquele projeto no
   * mesmo overlay — reusa `open`, que já cuida de histórico, scroll e
   * evento de GTM.
   */
  function renderMoreProjects(currentSlug) {
    if (!moreField) return;
    moreField.innerHTML = '';

    const pool = [...tiles].filter(
      (tile) =>
        tile.dataset.slug &&
        tile.dataset.slug !== currentSlug &&
        !tile.querySelector('.project-tile__wip')
    );

    // Fisher–Yates pra sortear sem viés, depois pega no máximo 3.
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const picks = pool.slice(0, 3);

    if (!picks.length) {
      moreField.hidden = true;
      return;
    }
    moreField.hidden = false;

    const heading = document.createElement('h3');
    heading.className = 'project-overlay__more-heading';
    heading.textContent = t.moreProjects;
    moreField.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'project-overlay__more-grid';

    picks.forEach((tile) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'project-overlay__more-card';
      card.setAttribute('aria-label', tile.dataset.name || '');
      if (tile.classList.contains('project-tile--dark')) {
        card.classList.add('project-overlay__more-card--dark');
      }

      const logo = tile.querySelector('.project-tile__logo');
      if (logo) {
        const img = document.createElement('img');
        img.className = 'project-overlay__more-logo';
        img.src = logo.currentSrc || logo.src;
        img.alt = tile.dataset.name || logo.alt || '';
        img.loading = 'lazy';
        img.decoding = 'async';
        // Sem logo carregado, mostra o nome no lugar da imagem quebrada
        // (mesmo fallback dos tiles — ver .project-tile--broken).
        img.addEventListener(
          'error',
          () => {
            img.remove();
            const name = document.createElement('span');
            name.className = 'project-overlay__more-name';
            name.textContent = tile.dataset.name || '';
            card.appendChild(name);
          },
          { once: true }
        );
        card.appendChild(img);
      } else {
        const name = document.createElement('span');
        name.className = 'project-overlay__more-name';
        name.textContent = tile.dataset.name || '';
        card.appendChild(name);
      }

      card.addEventListener('click', () => open(tile, { replaceUrl: true }));

      grid.appendChild(card);
    });

    moreField.appendChild(grid);
  }

  /**
   * Imagem intercalada entre seções de texto (ver PROJECT_CONTENT,
   * `sections` com `type: 'image'`). Mesma montagem picture/webp+fallback
   * de `content.media`, só que presa à largura do texto (.project-overlay__inner)
   * em vez de tela cheia — ver .project-overlay__inline-image no CSS.
   */
  function buildInlineImage(section) {
    const figure = document.createElement('figure');
    figure.className = 'project-overlay__inline-image';

    const picture = document.createElement('picture');
    if (section.src?.endsWith('.webp') && section.fallback) {
      const source = document.createElement('source');
      source.srcset = section.src;
      source.type = 'image/webp';
      picture.appendChild(source);
    }

    const img = document.createElement('img');
    img.src = section.fallback || section.src;
    img.alt = section.alt || '';
    if (section.width) img.width = section.width;
    if (section.height) img.height = section.height;
    img.loading = 'lazy';
    img.decoding = 'async';
    picture.appendChild(img);

    figure.appendChild(picture);
    return figure;
  }

  /**
   * Citação de cliente/stakeholder (ver PROJECT_CONTENT, `sections` com
   * `type: 'quote'`). `author`/`role` são opcionais — sem eles, mostra só
   * o texto da citação.
   */
  function buildQuote(section) {
    const quote = document.createElement('blockquote');
    quote.className = 'project-overlay__quote';

    const text = document.createElement('p');
    text.className = 'project-overlay__quote-text';
    text.textContent = section.text;
    quote.appendChild(text);

    if (section.author) {
      const footer = document.createElement('footer');
      footer.className = 'project-overlay__quote-author';

      // Avatar pequeno e redondo ao lado do nome — opcional, só entra
      // quando a citação tem `avatar` no PROJECT_CONTENT.
      if (section.avatar) {
        const picture = document.createElement('picture');
        if (section.avatar.src?.endsWith('.webp') && section.avatar.fallback) {
          const source = document.createElement('source');
          source.srcset = section.avatar.src;
          source.type = 'image/webp';
          picture.appendChild(source);
        }

        const avatarImg = document.createElement('img');
        avatarImg.className = 'project-overlay__quote-avatar';
        avatarImg.src = section.avatar.fallback || section.avatar.src;
        avatarImg.alt = section.avatar.alt || '';
        avatarImg.loading = 'lazy';
        avatarImg.decoding = 'async';
        picture.appendChild(avatarImg);

        footer.appendChild(picture);
      }

      const info = document.createElement('div');
      info.className = 'project-overlay__quote-author-info';

      const cite = document.createElement('cite');
      cite.textContent = section.author;
      info.appendChild(cite);

      if (section.role) {
        const role = document.createElement('span');
        role.className = 'project-overlay__quote-role';
        role.textContent = section.role;
        info.appendChild(role);
      }

      footer.appendChild(info);
      quote.appendChild(footer);
    }

    return quote;
  }

  /**
   * Números de resultado em destaque (ver PROJECT_CONTENT, `sections` com
   * `type: 'stats'`) — cada item é `{ value, label }`, renderizado lado a
   * lado (empilha no mobile via CSS, ver .project-overlay__stats).
   */
  function buildStats(section) {
    const row = document.createElement('div');
    row.className = 'project-overlay__stats';

    section.items?.forEach((item) => {
      const stat = document.createElement('div');
      stat.className = 'project-overlay__stat';

      const value = document.createElement('strong');
      value.className = 'project-overlay__stat-value';
      value.textContent = item.value;

      const label = document.createElement('span');
      label.className = 'project-overlay__stat-label';
      label.textContent = item.label;

      stat.append(value, label);
      row.appendChild(stat);
    });

    return row;
  }

  /**
   * Selo "desenvolvido para cliente da [parceiro]" (ver ZALIEZA_PARTNER em
   * PROJECT_CONTENT) — projetos captados via agência, não diretamente pelo
   * cliente final. Link sai em nova aba, igual o CTA "ver site no ar".
   */
  function buildPartnerNote(partner) {
    const note = document.createElement('a');
    note.className = 'project-overlay__partner-note';
    note.href = partner.url;
    note.target = '_blank';
    note.rel = 'noopener noreferrer';

    const text = document.createElement('span');
    text.textContent = partner.text;
    note.appendChild(text);

    if (partner.logo) {
      const img = document.createElement('img');
      img.className = 'project-overlay__partner-logo';
      img.src = partner.logo.src;
      img.alt = partner.logo.alt || partner.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      note.appendChild(img);
    } else {
      const name = document.createElement('strong');
      name.textContent = partner.name;
      note.appendChild(name);
    }

    return note;
  }

  function close({ syncUrl = true } = {}) {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('has-overlay');
    lenis?.start();
    if (lastFocused instanceof HTMLElement) lastFocused.focus();

    currentSlug = null;

    // Só mexe na URL quando o fechamento partiu de um gesto do usuário
    // (botão, fundo, Escape). Se veio do popstate (voltar), a URL já
    // está limpa.
    if (syncUrl && slugFromHash()) {
      if (pushedHistoryEntry) {
        // Abrimos via clique (empilhamos uma entrada): voltar remove o
        // hash e mantém o histórico consistente. Um replaceState posterior
        // (troca de projeto pelos cards) não conta — segue sendo a mesma
        // entrada empilhada aqui.
        window.history.back();
      } else {
        // Deep link direto, sem entrada nossa pra voltar: só troca a URL.
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search
        );
      }
    }

    pushedHistoryEntry = false;
  }

  // Voltar/avançar do navegador: sincroniza o overlay com a URL.
  window.addEventListener('popstate', () => {
    const slug = slugFromHash();
    const tile = slug ? slugToTile.get(slug) : null;

    if (tile && !tile.querySelector('.project-tile__wip')) {
      if (slug !== currentSlug) open(tile, { syncUrl: false });
    } else if (overlay.classList.contains('is-open')) {
      close({ syncUrl: false });
    }
  });

  // Link direto (`robsonvital.com.br/#/projetos/jumper`): abre o case já
  // no carregamento.
  const initialSlug = slugFromHash();
  const initialTile = initialSlug ? slugToTile.get(initialSlug) : null;
  if (initialTile && !initialTile.querySelector('.project-tile__wip')) {
    open(initialTile, { syncUrl: false });
  }

  // Tiles marcados como "em andamento" (ver .project-tile__wip no
  // index.html) ainda não têm case study pra mostrar — não abre o
  // overlay nesses, só no clique de tiles concluídos. Tiles que são
  // link (<a>, ex.: Moodboard Studio) têm página de case própria e
  // navegam pra ela no clique — não passam pelo overlay.
  tiles.forEach((tile) => {
    if (tile.tagName === 'A') return;
    if (tile.querySelector('.project-tile__wip')) return;
    tile.addEventListener('click', () => open(tile));
  });

  // Rolou um tico: esconde a seta animada da capa (ver
  // .project-overlay__scroll-hint no CSS).
  if (scroller) {
    scroller.addEventListener(
      'scroll',
      () => {
        scroller.classList.toggle('is-scrolled', scroller.scrollTop > 24);
      },
      { passive: true }
    );
  }

  closeBtn.addEventListener('click', close);

  // Clique no fundo (fora do conteúdo) também fecha. Com o wrapper
  // `__scroll` cobrindo todo o overlay (inset:0), o "fundo" clicável é
  // o próprio scroller fora do `__inner` — não mais `overlay` direto.
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target === scroller) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
      // A tela de contato (ver contact.js) pode estar aberta por cima
      // deste overlay — nesse caso é ela quem deve fechar primeiro; seu
      // próprio listener de Escape cuida disso.
      const contactOverlay = document.getElementById('contactOverlay');
      if (contactOverlay?.classList.contains('is-open')) return;
      close();
    }
  });
}
