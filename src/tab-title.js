const PHRASES = [
  'Volta aqui vai. 🥺',
  'Tô te esperando...',
  'Não esqueça de mim.',
  'Que tal voltar aqui.',
  'Psiuuuu!!',
];

function pickRandomPhrase() {
  return PHRASES[Math.floor(Math.random() * PHRASES.length)];
}

export function initTabTitle() {
  const originalTitle = document.title;

  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? pickRandomPhrase() : originalTitle;
  });
}
