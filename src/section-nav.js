import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Marcador lateral de seção (linhas horizontais fixas na lateral
 * direita). Cada item liga `.is-active` via ScrollTrigger enquanto a
 * seção correspondente está perto do centro da viewport, e o clique
 * rola até lá usando o mesmo Lenis do resto da página (quando
 * disponível — reduced motion não inicializa o Lenis, ver main.js).
 */
export function initSectionNav({ lenis }) {
  const items = document.querySelectorAll('.section-nav__item');
  if (!items.length) return;

  items.forEach((item) => {
    const target = document.getElementById(item.dataset.target);
    if (!target) return;

    ScrollTrigger.create({
      trigger: target,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => item.classList.toggle('is-active', self.isActive),
    });

    item.addEventListener('click', (event) => {
      event.preventDefault();
      const y = documentTop(target);
      if (lenis) {
        lenis.scrollTo(y, { duration: 1.2 });
      } else {
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

/**
 * Posição do elemento no fluxo do documento, em px, medida a partir do
 * topo — a mesma coisa que `getBoundingClientRect().top + scrollY`
 * DARIA se o elemento não fosse `position: sticky` (ver "Empilhamento
 * de seções" em style.css: toda `main > section`, incluindo os alvos
 * deste nav, é sticky).
 *
 * Por que não dá pra usar `target` (elemento) direto em
 * `lenis.scrollTo`/`scrollIntoView`: os dois calculam o destino a
 * partir do rect ATUAL do elemento na viewport. Isso funciona vindo de
 * cima (a seção ainda não "grudou", rect.top reflete a distância real).
 * Mas clicando a partir de uma seção mais abaixo (Trajetória, Contato),
 * a seção-alvo já passou pelo seu próprio intervalo de sticky e
 * `rect.top` fica "preso" perto de 0 (o `top:0` do CSS) em vez de
 * voltar a um valor negativo — o cálculo dá `~scrollY atual`, ou seja,
 * "já estou lá", e o scroll não sai do lugar (bug visto: link
 * "Projetos" não fazia nada partindo de Trajetória/Contato).
 *
 * Contorno: desliga o sticky (`position: static`) só pra medir, e
 * religa em seguida — tudo síncrono, sem `await` no meio, então o
 * navegador nunca chega a pintar esse estado intermediário.
 */
function documentTop(el) {
  const { position: prevPosition, top: prevTop } = el.style;
  el.style.position = 'static';
  const rect = el.getBoundingClientRect();
  el.style.position = prevPosition;
  el.style.top = prevTop;
  return rect.top + window.scrollY;
}
