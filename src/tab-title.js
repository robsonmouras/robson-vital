import { t } from './i18n.js';

const PHRASES = t.tabPhrases;

function pickRandomPhrase() {
  return PHRASES[Math.floor(Math.random() * PHRASES.length)];
}

export function initTabTitle() {
  const originalTitle = document.title;

  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? pickRandomPhrase() : originalTitle;
  });
}
