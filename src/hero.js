import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero: animação de entrada do nome (esquerda -> direita) e, no scroll,
 * a cabeça desliza do centro até ficar docada na lateral esquerda — só
 * que deslocada meia caixa pra fora do viewport, então é o lado
 * esquerdo do rosto que some por trás da borda da tela, não um
 * clip-path reto cortando a foto ao meio. O lado direito, que fica
 * visível, mantém o contorno natural do rosto (a foto já é um recorte
 * de fundo transparente) — importa pra abertura de cada seção mais
 * adiante.
 */
export function initHero({ prefersReducedMotion }) {
  const anchor = document.getElementById('heroAnchor');
  const head = document.getElementById('heroHead');
  if (!anchor || !head) return;

  playEntrance({ prefersReducedMotion });

  if (!prefersReducedMotion) {
    dockHeadOnScroll({ anchor, head });
  }
}

function playEntrance({ prefersReducedMotion }) {
  if (prefersReducedMotion) return; // conteúdo já visível via CSS (sem classe animada)

  const tl = gsap.timeline({ delay: 0.15 });

  tl.to('[data-line="0"]', {
    opacity: 1,
    x: 0,
    duration: 1.1,
    ease: 'expo.out',
  })
    .to(
      '[data-line="1"]',
      { opacity: 1, x: 0, duration: 1.1, ease: 'expo.out' },
      '-=0.85'
    )
    .to(
      '.hero__content',
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )
    .to('.hero__scroll-cue', { opacity: 1, duration: 0.6 }, '-=0.3');
}

function dockHeadOnScroll({ anchor, head }) {
  // Mesmo breakpoint do style.css (ver @media max-width:720px): abaixo
  // dele a cabeça docada (aspect-ratio 0.78/1 * 100svh) cobre largura
  // demais pra sobrar espaço de leitura nas seções seguintes — pedido
  // do cliente foi trocar o dock por um simples desaparecimento, sem
  // reservar respiro lateral nenhum pra ela (ver ajustes no
  // .projects/.trajectory do style.css).
  const isMobile = window.matchMedia('(max-width: 720px)').matches;

  // Referência de scroll compartilhada por tudo, pra ficar tudo em
  // sincronia perfeita.
  const scrollRange = {
    trigger: anchor,
    start: 'top top',
    end: '+=100%',
    invalidateOnRefresh: true,
  };

  // Estado inicial explícito (centralizado, rosto inteiro) — evita depender
  // só do CSS caso o ScrollTrigger seja recriado (resize, etc.).
  gsap.set(head, { x: () => window.innerWidth / 2, xPercent: -50 });

  // O nome também passa a ter seu `transform` controlado pelo GSAP (em vez
  // de só o `translate(-50%,-50%)` fixo do CSS) — precisa disso pra poder
  // somar o deslocamento horizontal calculado abaixo sem brigar com a
  // centralização. xPercent/yPercent replicam exatamente o que o CSS já
  // fazia, então não há salto visual no estado de repouso.
  //
  // `x: 0, y: 0` explícitos aqui não são redundantes — sem eles, o GSAP
  // tenta decompor o `transform: translate(-50%, -50%)` que o CSS já
  // aplicou (pra não dar salto visual) e, em certas larguras de tela
  // específicas (bug real do GSAP 3.15, reproduzido isolado fora deste
  // projeto: some/reaparece de forma intermitente conforme o innerWidth,
  // sem relação com o breakpoint mobile), essa decomposição falha e
  // GSAP DUPLICA o deslocamento — o nome nasce empurrado uma altura
  // inteira pra cima, cortado no topo da tela (era o bug visto em
  // 1490×740: "ROBSON" ilegível). Declarar x/y como 0 aqui força o GSAP
  // a partir de um estado limpo, sem precisar decompor nada.
  const nameLayers = ['.hero__name--back', '.hero__name--front'];
  gsap.set(nameLayers, { x: 0, y: 0, xPercent: -50, yPercent: -50 });

  // Quanto empurrar o nome pra direita quando a cabeça estiver
  // completamente docada, pra sobrar um respiro de 48px entre a borda
  // visível da foto (metade direita da caixa — a esquerda já saiu do
  // viewport) e o começo do texto.
  function nameDockShiftX() {
    const nameFront = document.querySelector('.hero__name--front');
    if (!nameFront) return 0;
    const headVisibleRightEdge = head.offsetWidth / 2; // docada: só a metade direita da caixa fica dentro do viewport
    const naturalLeftEdge = (window.innerWidth - nameFront.offsetWidth) / 2; // borda esquerda do nome centralizado, sem deslocamento
    return headVisibleRightEdge + 48 - naturalLeftEdge;
  }

  // Corta o nome (cópia da frente) com uma linha reta que sobe de baixo
  // pra cima, acompanhando a borda de cima da PRÓXIMA seção (main >
  // section, ver style.css) — em vez de esmaecer. Não existe espaçador
  // de scroll reservado só pro dock: a seção seguinte entra por baixo
  // na mesma rolagem, subindo 1:1 com o scroll (sobe exatamente
  // `scrollY` px a cada `scrollY` px rolado). Ou seja, a borda de cima
  // dela, em coordenadas de viewport, é `innerHeight * (1 - progresso)`.
  //
  // Usa `tl.progress()` (progresso JÁ SUAVIZADO pelo scrub), não
  // `self.progress` do ScrollTrigger (que é o scroll bruto, sem o
  // atraso do scrub) — senão a linha de corte andaria à frente da
  // cabeça/nome durante a rolagem rápida, já que essas duas outras
  // propriedades seguem o tempo suavizado do timeline, não o scroll
  // instantâneo.
  //
  // Recalcula tudo a cada frame a partir da geometria AO VIVO
  // (getBoundingClientRect, innerHeight) — de propósito, em vez de medir
  // uma vez só no setup: essa medição aconteceria antes da fonte Foun
  // Pro necessariamente já ter carregado, e o nome muda de largura (e
  // depende do viewport via clamp) em cada resize. Lendo ao vivo, a
  // linha de corte nunca fica desatualizada.
  // `let` (não `const`) e checado abaixo de propósito: o GSAP pode
  // chamar `onUpdate` de forma síncrona já durante a criação do
  // ScrollTrigger, dentro da própria chamada `gsap.timeline(...)` —
  // antes da atribuição a `tl` terminar. Sem essa guarda, a primeira
  // chamada de `applyNameClip` quebraria tentando ler `tl.progress()`
  // de um valor ainda não atribuído.
  let tl;

  function applyNameClip() {
    if (!tl) return; // primeiro tick antes de `tl` existir — CSS (inset(0)) já cobre esse instante
    const nameFront = document.querySelector('.hero__name--front');
    if (!nameFront) return;
    const rect = nameFront.getBoundingClientRect();
    const vh = window.innerHeight;
    const nextSectionEdgeY = vh * (1 - tl.progress());
    const hiddenPx = Math.min(rect.height, Math.max(0, rect.bottom - nextSectionEdgeY));
    const hiddenPercent = rect.height > 0 ? (hiddenPx / rect.height) * 100 : 0;
    nameFront.style.clipPath = `inset(0 0 ${hiddenPercent}% 0)`;
  }

  tl = gsap
    .timeline({
      scrollTrigger: { ...scrollRange, scrub: 0.4, onUpdate: applyNameClip },
    })
    .fromTo(
      head,
      { x: () => window.innerWidth / 2, xPercent: -50 },
      isMobile
        // Mobile: sem dock — a cabeça só some (fade). `.hero__head`
        // ganha `pointer-events: none` no breakpoint mobile (style.css)
        // pra essa camada, invisível mas ainda `fixed` e centralizada,
        // não bloquear toques no conteúdo por baixo depois do fade.
        ? { opacity: 0, ease: 'none' }
        // Desktop/tablet: doca deslocada meia caixa pra esquerda do
        // viewport — o lado esquerdo do rosto passa pra fora da tela
        // (escondido pela borda do viewport, não por clip-path) e só o
        // lado direito fica visível.
        : { x: () => -head.offsetWidth / 2, xPercent: 0, ease: 'none' },
      0
    )
    .fromTo(
      nameLayers,
      { x: 0 },
      // Mesmo no mobile (sem dock — ver acima) o nome continua sendo
      // empurrado por essa mesma conta: `head` continua ocupando o
      // mesmo espaço de sempre (só a opacidade anima, a caixa não
      // muda), e como a cabeça é bem larga nessa largura de tela, o
      // resultado empurra "ROBSON"/"VITAL" quase inteiramente pra fora
      // do viewport — sem isso, o clip-path abaixo deixa o nome
      // AINDA VISÍVEL bem em cima do título da próxima seção
      // ("PROJETOS") por um instante, os dois grudados sem respiro
      // nenhum entre si (bug visto testando no mobile).
      { x: nameDockShiftX, ease: 'none' },
      0
    )
    // "Robson" (frente) nasce branco — lê bem sobre a foto/boné escuros.
    // Assim que a cabeça começa a se afastar dessa área, ela deixa de
    // ter uma foto escura por baixo — sem isso ficaria "branco no
    // branco" contra o fundo da página assim que a seção destrava.
    // "Vital" já nasce vermelho (não precisa desse esmaecimento: vermelho
    // lê bem tanto sobre a foto quanto sobre o fundo branco).
    .to(
      '.hero__name--front [data-line="0"]',
      { color: '#0f172a', ease: 'none', duration: 0.85 },
      0.15
    )
    // "Robson" e "Vital" começam em degrau (ver margin-left no
    // style.css) e se alinham conforme a cabeça doca na lateral —
    // pedido do cliente: uma vez destravado o scroll, o nome fica
    // "arrumado", uma palavra embaixo da outra. O destino não é 0em:
    // o traço reto do "R" e a ponta aberta do "V" não têm o mesmo
    // avanço lateral (side bearing) na fonte, então alinhar as CAIXAS
    // em 0 deixa o "V" ~0.036em à esquerda do "R" a olho nu. 0.036em
    // é o ajuste óptico medido pixel a pixel (renderização isolada,
    // sem antialiasing de outros elementos) pra fazer o V bater
    // exatamente com o traço do R.
    .to(
      '.hero__name-line[data-line="1"]',
      { marginLeft: '0.036em', ease: 'none' },
      0
    )
    // Tagline some logo no início do scroll: nesse trecho a cabeça e o
    // nome já estão se reorganizando pros lados, e o texto fixo no
    // canto inferior esquerdo (parado enquanto a página rola por baixo)
    // ficava esquisito ali no meio da transição — melhor sumir cedo e só
    // reaparecer se o usuário voltar pro topo.
    .to('.hero__content', { opacity: 0, ease: 'none', duration: 0.3 }, 0);

  // Nome-atrás, nome-frente e o grupo de UI (tagline/redes/scroll cue)
  // "ficam na tela" durante a transição via um simples toggle de classe
  // (position: absolute -> fixed), em vez do `pin` do GSAP.
  //
  // Por quê: o `pin` do GSAP sempre cria um novo stacking context, e
  // pinar várias camadas separadas no MESMO ponto de trigger se mostrou
  // instável (uma delas media 0x0 depois de pinada). Como o #heroAnchor
  // ocupa exatamente 0,0/100vw/100svh, alternar essas camadas entre
  // absolute (relativas a ele) e fixed (relativas à viewport) dá o
  // mesmíssimo resultado visual nos dois estados — sem salto, sem
  // depender do mecanismo interno de pin do GSAP.
  ScrollTrigger.create({
    ...scrollRange,
    onToggle: (self) => anchor.classList.toggle('is-pinned', self.isActive),
  });

  // Seção Contato (última da página, ver #contact no index.html): a
  // cabeça docada precisa sumir ali. `.contact` (como `.trajectory`
  // antes dela) sobe por trás das seções anteriores em vez de "aparecer"
  // de repente — desde que seu topo cruza o rodapé da viewport ('top
  // bottom') até grudar cobrindo a tela inteira ('top top', o mesmo
  // instante em que o card fica centralizado — ver .contact__stage no
  // style.css). Por isso o fade acompanha esse MESMO intervalo via
  // scrub, em vez de só começar no instante em que gruda: sem isso, o
  // card já aparecia centralizado mas a cabeça só começava a sumir a
  // partir dali, ficando visivelmente atrasada. Scrubado, termina
  // exatamente em opacity:0 no instante em que o card já está
  // centralizado — e reverte sozinho ao rolar de volta, sem precisar de
  // onEnter/onLeaveBack separados. Só no desktop/tablet: no mobile a
  // cabeça já terminou de sumir (fade) no fim do dock acima.
  if (!isMobile) {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      gsap.to(head, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: contactSection,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      });
    }
  }
}
