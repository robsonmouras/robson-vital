/**
 * Idioma da página, definido pelo atributo `lang` do <html> (pt-BR em
 * index.html, en em en/index.html). Os textos que o JS injeta na tela
 * (overlay de projeto, título da aba) saem daqui; o conteúdo dos cases
 * fica em src/content/projects.<idioma>.js.
 */
export const LANG = document.documentElement.lang.toLowerCase().startsWith('en')
  ? 'en'
  : 'pt';

const STRINGS = {
  pt: {
    visitProject: 'Ver projeto no ar',
    moreProjects: 'Veja outros projetos',
    tabPhrases: [
      'Volta aqui vai. 🥺',
      'Tô te esperando...',
      'Não esqueça de mim.',
      'Que tal voltar aqui.',
      'Psiuuuu!!',
    ],
  },
  en: {
    visitProject: 'View live project',
    moreProjects: 'See other projects',
    tabPhrases: [
      'Come back, please. 🥺',
      "I'm still waiting...",
      "Don't forget about me.",
      'How about coming back?',
      'Psst!!',
    ],
  },
};

export const t = STRINGS[LANG];
