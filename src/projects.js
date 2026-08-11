import { gsap } from 'gsap';

/**
 * Conteúdo detalhado (case study) de cada projeto, mostrado no overlay
 * em tela cheia ao clicar num tile — ver initOverlay/renderProjectBody
 * abaixo. Chave = mesmo texto de `data-name` no tile (index.html).
 * Projeto sem entrada aqui cai no aviso placeholder
 * (.project-overlay__placeholder-note).
 */
const PROJECT_CONTENT = {
  Jumper: {
    media: {
      // Gerado a partir do print original (~1.7MB) via sharp-cli,
      // redimensionado pra 2000px de largura — ver public/images/projects.
      src: '/images/projects/jumper-showcase.webp',
      fallback: '/images/projects/jumper-showcase.jpg',
      width: 2000,
      height: 1116,
      alt: 'Home do novo site da Jumper aberta em um notebook, com o título "Cuidamos da sua operação para que você cuide do seu negócio."',
    },
    url: 'https://jumperseg.com.br/',
    tags: ['Vibe coding', 'GSAP', 'Animações de scroll', 'Copy de conversão'],
    sections: [
      {
        heading: 'O problema',
        text: 'A Jumper, grupo que integra segurança, facilities e tecnologia, tinha um site antigo, feito em WordPress. Visual genérico, sem hierarquia de conteúdo e nenhuma estrutura pensada pra converter visita em contato.',
      },
      {
        heading: 'O que eu fiz',
        text: 'Projetei o site inteiro em vibe coding: fluxo apoiado em IA pra ganhar velocidade, mas com cada tela, animação e linha de copy revisada e ajustada à mão, sem deixar nada com "cara de IA". Site do zero, sem WordPress, com animações em GSAP orientadas a scroll pra guiar o visitante pela narrativa da marca, e conteúdo reescrito seção por seção com foco em conversão.',
      },
      {
        heading: 'Resultado',
        text: 'Um site entregue rápido e que carrega rápido, no nível da operação que a Jumper representa, da segurança patrimonial ao centro de controle 24/7, com uma experiência de scroll que segura atenção, leva à ação e não parece ter saído de um gerador automático.',
      },
    ],
  },
  'Grupo RCR': {
    media: {
      // Gerado a partir do print original (~1.4MB) via sharp-cli,
      // redimensionado pra 2000px de largura — ver public/images/projects.
      src: '/images/projects/rcr-showcase.webp',
      fallback: '/images/projects/rcr-showcase.jpg',
      width: 2000,
      height: 1116,
      alt: 'Home do novo site do Grupo RCR aberta em um notebook, com o título "Cuidar de pessoas, Proteger patrimônios, Servir com excelência".',
    },
    url: 'http://gruporcr.com.br/',
    tags: ['Código moderno (sem WordPress)', 'WordPress (blog)', 'Copy de conversão'],
    sections: [
      {
        heading: 'O problema',
        text: 'O Grupo RCR já tinha um site, mas ele não acompanhava o momento da empresa, um crescimento exponencial na sua área, e deixava a operação parecer menor do que é.',
      },
      {
        heading: 'O que eu fiz',
        text: 'Desenhei o layout no Figma e validei cada tela com o cliente antes de sair codando. Só depois disso reconstruí o site institucional do zero em código moderno, sem WordPress, em torno de uma narrativa clara: "cuidar de pessoas, proteger patrimônios, servir com excelência". O blog ficou em WordPress, separado da parte institucional, pra facilitar a publicação de conteúdo pela equipe da RCR.',
      },
      {
        heading: 'Resultado',
        text: 'Uma presença digital à altura do crescimento do Grupo RCR, com um site institucional rápido e moderno e um blog fácil de manter para a própria equipe.',
      },
    ],
  },
  Inov9: {
    media: {
      // Gerado a partir do print original via sharp-cli, redimensionado
      // pra 2000px de largura — ver public/images/projects.
      src: '/images/projects/inov9-showcase.webp',
      fallback: '/images/projects/inov9-showcase.jpg',
      width: 2000,
      height: 1116,
      alt: 'Home do novo site do Grupo Inov9 aberta em um notebook, com o título "Segurança e facilities que garantem a continuidade do seu negócio."',
    },
    url: 'https://grupoinov9.com.br/',
    tags: ['WordPress', 'Elementor', 'Identidade visual'],
    sections: [
      {
        heading: 'O problema',
        text: 'O Grupo Inov9, segurança, facilities e tecnologia, ainda não tinha site. Sem presença digital, a empresa não tinha como transmitir pra quem chegava até ela o ponto em que já estava: uma operação madura e estruturada.',
      },
      {
        heading: 'O que eu fiz',
        text: 'Desenhei o site inteiro no Figma primeiro e validei o projeto com o cliente antes de subir pro WordPress. Só depois construí o site em WordPress com Elementor, organizando as soluções, a metodologia e as frentes de atuação (facilities, segurança patrimonial) numa estrutura clara, com identidade visual alinhada à marca.',
      },
      {
        heading: 'Resultado',
        text: 'Um site novo que trouxe modernidade pra presença digital da Inov9 e passa, com mais fidelidade, o estágio em que a empresa está hoje.',
      },
    ],
  },
};

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
  const nameRowField = overlay.querySelector('[data-name-row]');
  const serviceField = overlay.querySelector('[data-field="service"]');
  const mediaField = overlay.querySelector('[data-project-media]');
  const bodyField = overlay.querySelector('[data-project-body]');
  const placeholderNote = overlay.querySelector('[data-placeholder-note]');

  let lastFocused = null;

  function open(tile) {
    if (nameField) nameField.textContent = tile.dataset.name || '';
    if (serviceField) serviceField.textContent = tile.dataset.service || '';
    renderProjectBody(tile.dataset.name);
    if (scroller) scroller.scrollTop = 0;

    lastFocused = document.activeElement;
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.body.classList.add('has-overlay');
    lenis?.stop();
    closeBtn.focus();
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
    nameRowField?.querySelector('.project-overlay__visit')?.remove();

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
    }

    // Ícone "abrir site" do lado do título, alinhado ao topo da palavra
    // (ver .project-overlay__name-row). Só aparece pra quem tem `url`
    // no PROJECT_CONTENT (limpo no topo desta função a cada render).
    if (content.url && nameRowField) {
      const link = document.createElement('a');
      link.className = 'project-overlay__visit';
      link.href = content.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', 'Abrir site em uma nova aba');
      link.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></svg>';
      nameRowField.appendChild(link);
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
      const wrap = document.createElement('div');
      wrap.className = 'project-overlay__section';

      const heading = document.createElement('h3');
      heading.className = 'project-overlay__section-heading';
      heading.textContent = section.heading;

      const text = document.createElement('p');
      text.className = 'project-overlay__section-text';
      text.textContent = section.text;

      wrap.append(heading, text);
      bodyField.appendChild(wrap);
    });
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('has-overlay');
    lenis?.start();
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  // Tiles marcados como "em andamento" (ver .project-tile__wip no
  // index.html) ainda não têm case study pra mostrar — não abre o
  // overlay nesses, só no clique de tiles concluídos.
  tiles.forEach((tile) => {
    if (tile.querySelector('.project-tile__wip')) return;
    tile.addEventListener('click', () => open(tile));
  });

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
