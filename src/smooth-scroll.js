import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Liga o Lenis (smooth scroll) ao ticker do GSAP, para que o scroll suave
 * e as animações fiquem sincronizados no mesmo frame.
 * Não é ativado se o usuário pedir menos movimento no sistema.
 */
export function initSmoothScroll({ prefersReducedMotion }) {
  if (prefersReducedMotion) return null;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
