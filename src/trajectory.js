import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Seção Trajetória: timeline em texto puro, uma experiência por vez, que
 * corre HORIZONTALMENTE conforme o scroll vertical da página — não é uma
 * seção que rola normalmente, é um "scroll-jack" clássico (scroll vertical
 * vira progresso de uma animação horizontal), construído sem o `pin` do
 * GSAP: quem prende o conteúdo no lugar é o CSS (`.trajectory__stage`,
 * `position: sticky`, ver style.css) — aqui só aplicamos a altura extra
 * (100svh + orçamento das 2 fases) na seção-PAI (`#trajectory`), que dá
 * ao stage a folga necessária pra ficar grudado durante toda a rolagem
 * interna (ver comentário longo no index.html sobre por que não pode ser
 * a seção inteira a fazer o sticky).
 *
 * As 2 fases (todas dentro do MESMO ScrollTrigger, uma timeline só):
 *  1) Track — desloca `.trajectory__track` em xPercent, uma experiência
 *     por vez, com snap pra cada parada.
 *  2) Saída (placeholder) — marcador na altura da boca aparece, sinalizando
 *     a transição pra próxima etapa (CTA, conteúdo ainda não definido).
 *
 * (Houve uma 3ª fase de entrada — marcador + linha desenhada na altura dos
 * olhos — removida: o traço ficava com um formato de "]--" que não ficou
 * legal visualmente. Pode voltar depois com outro tratamento visual.)
 */
export function initTrajectory({ prefersReducedMotion } = {}) {
  const section = document.getElementById('trajectory');
  const track = document.getElementById('trajectoryTrack');
  const items = section?.querySelectorAll('.trajectory__item');
  const exitMarker = document.getElementById('trajectoryExitMarker');
  if (!section || !track || !items?.length || !exitMarker) return;

  // Independente do scroll-jack (roda mesmo com reduced motion, igual ao
  // popover dos tiles em Projetos, que também segue o cursor sem gate):
  // é uma micro-interação sob demanda do hover, não uma animação
  // automática.
  initCompanyLogoFollow(section);

  // Reduced motion: sem scroll-jack. O fallback (fluxo vertical normal,
  // todas as 5 experiências legíveis em sequência) vive só no CSS — ver
  // bloco `@media (prefers-reduced-motion: reduce)` em style.css.
  if (prefersReducedMotion) return;

  const count = items.length;

  // Orçamento de scroll de cada fase, em vh — também usado como duração
  // dos tweens na timeline abaixo (unidades arbitrárias iguais às do
  // scrub: como é tudo proporcional, usar "vh" como unidade de tempo
  // também deixa o mapeamento scroll->progresso direto, 1:1).
  const STEP_VH = 90; // por transição entre experiências
  const TRACK_VH = STEP_VH * (count - 1);
  const EXIT_VH = 70;
  const TOTAL_VH = TRACK_VH + EXIT_VH;

  section.style.height = `calc(100svh + ${TOTAL_VH}vh)`;

  gsap.set(exitMarker, { opacity: 0 });

  const stepXPercent = 100 / count;
  const finalXPercent = -stepXPercent * (count - 1);

  // Pontos de snap: início (0), cada parada do track, e o fim (1). Evita
  // que o usuário solte o scroll no meio de uma transição entre
  // experiências — sempre assenta numa delas (ou na borda da fase de
  // saída).
  const snapPoints = [0];
  for (let i = 1; i < count; i++) {
    snapPoints.push((STEP_VH * i) / TOTAL_VH);
  }
  snapPoints.push(1);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      // ScrollTrigger NÃO entende sufixo `vh` em offsets relativos
      // (`+=`) — só `%` (relativo ao tamanho do trigger), palavras-chave
      // ou número puro em px (ver `_offsetToPx` no código-fonte do GSAP:
      // ele faz `parseFloat("490vh")`, que dá 490 — e trata isso como
      // 490px, não 490vh). Por isso o cálculo manual aqui, em função (não
      // string fixa) pra recalcular certo em resize, junto com
      // `invalidateOnRefresh`.
      end: () => `+=${(TOTAL_VH * window.innerHeight) / 100}`,
      scrub: 0.4,
      invalidateOnRefresh: true,
      snap: {
        snapTo: snapPoints,
        duration: { min: 0.2, max: 0.5 },
        ease: 'power1.inOut',
      },
    },
  });

  // Fase 1 — track horizontal, desde o topo da rolagem interna.
  tl.to(track, { xPercent: finalXPercent, ease: 'none', duration: TRACK_VH }, 0);

  // Fase 2 — placeholder de saída (CTA).
  tl.to(
    exitMarker,
    { opacity: 1, duration: EXIT_VH * 0.6 },
    TRACK_VH + EXIT_VH * 0.25
  );
}

/**
 * Logo que segue o cursor ao passar sobre o nome de cada empresa
 * (`.trajectory__company`, ver index.html — cada span carrega o caminho
 * do arquivo em `data-logo`). Mesma técnica do popover dos tiles em
 * Projetos (ver initTilePopovers em projects.js): `xPercent`/`yPercent`
 * fixados uma vez centralizam a imagem sobre o ponteiro, só x/y em px é
 * animado depois via `gsap.quickTo`.
 *
 * O elemento flutuante (`#trajectoryLogoFloat`) é `position: fixed` e
 * mora fora de `.trajectory__stage` no DOM de propósito — ver comentário
 * junto dele no index.html — por isso as coordenadas usadas aqui são as
 * de viewport (`clientX`/`clientY`), sem precisar descontar scroll nem
 * a posição do item dentro do track.
 */
function initCompanyLogoFollow(section) {
  const floatEl = document.getElementById('trajectoryLogoFloat');
  const logoImg = floatEl?.querySelector('.trajectory-logo-float__img');
  const companies = section.querySelectorAll('.trajectory__company');
  if (!floatEl || !logoImg || !companies.length) return;

  gsap.set(floatEl, { xPercent: -50, yPercent: -50 });
  const setX = gsap.quickTo(floatEl, 'x', { duration: 0.35, ease: 'power3' });
  const setY = gsap.quickTo(floatEl, 'y', { duration: 0.35, ease: 'power3' });

  function move(event) {
    setX(event.clientX);
    setY(event.clientY);
  }

  companies.forEach((company) => {
    const logoSrc = company.dataset.logo;
    if (!logoSrc) return;

    company.addEventListener('pointerenter', (event) => {
      logoImg.src = logoSrc;
      logoImg.alt = company.textContent.trim();
      gsap.to(floatEl, { opacity: 1, duration: 0.2 });
      move(event);
    });
    company.addEventListener('pointermove', move);
    company.addEventListener('pointerleave', () => {
      gsap.to(floatEl, { opacity: 0, duration: 0.2 });
    });
  });
}
