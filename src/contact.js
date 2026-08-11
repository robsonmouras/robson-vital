/**
 * Tela de contato ("Fale comigo"), aberta a partir do CTA dentro do
 * overlay de projeto (ver .project-overlay__contact-cta em index.html) —
 * qualquer elemento com `[data-open-contact]` na página abre essa tela.
 * Mesma mecânica de foco/Escape do overlay de projeto (ver projects.js),
 * mas em z-index maior, pra abrir POR CIMA dele sem fechá-lo por baixo.
 */
export function initContact({ lenis } = {}) {
  const overlay = document.getElementById('contactOverlay');
  const closeBtn = document.getElementById('contactOverlayClose');
  const triggers = document.querySelectorAll('[data-open-contact]');
  if (!overlay || !closeBtn) return;

  let lastFocused = null;

  function open() {
    lastFocused = document.activeElement;
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.body.classList.add('has-overlay');
    // Só chama lenis.stop() se ainda não tiver sido chamado pelo overlay
    // de projeto por baixo (ver projects.js) — stop()/start() do Lenis
    // não contam referência, então stop() duplicado é inofensivo, mas
    // isolar aqui deixa esta tela funcional mesmo aberta sozinha, sem
    // depender do overlay de projeto ter sido aberto antes.
    lenis?.stop();
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    // Só libera o scroll/lenis se o overlay de projeto não estiver aberto
    // por baixo — senão essa tela "vazaria" o scroll de fundo enquanto o
    // outro overlay ainda devia mantê-lo travado.
    const projectOverlay = document.getElementById('projectOverlay');
    if (!projectOverlay?.classList.contains('is-open')) {
      document.body.classList.remove('has-overlay');
      lenis?.start();
    }
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  triggers.forEach((trigger) => trigger.addEventListener('click', open));
  closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
      close();
    }
  });
}
