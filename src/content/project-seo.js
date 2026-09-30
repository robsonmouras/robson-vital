// Metadados de cada case pras páginas próprias geradas no build (ver plugin
// `projectPages` no vite.config.js): título, descrição e imagem do preview
// de compartilhamento (WhatsApp, LinkedIn, etc.). Fica separado de
// projects.<idioma>.js porque o vite.config.js roda em Node, onde
// `import.meta.env` (usado lá nos caminhos das imagens) não existe.
// A chave é o `data-slug` do tile no index.html.
export const PROJECT_SEO = {
  jumper: {
    image: 'images/projects/jumper-showcase.jpg',
    pt: {
      title: 'Jumper | Website, case de Robson Vital',
      description:
        'Site da Jumper (segurança, facilities e tecnologia) projetado e desenvolvido do zero, com animações de scroll em GSAP e copy focada em conversão.',
    },
    en: {
      title: 'Jumper | Website, case by Robson Vital',
      description:
        'Website for Jumper (security, facilities and technology) designed and built from scratch, with GSAP scroll animations and conversion-focused copy.',
    },
  },
  inov9: {
    image: 'images/projects/inov9-showcase.jpg',
    pt: {
      title: 'Inov9 | Website em WordPress, case de Robson Vital',
      description:
        'Primeiro site do Grupo Inov9: layout desenhado e validado no Figma, depois construído em WordPress com Elementor.',
    },
    en: {
      title: 'Inov9 | WordPress website, case by Robson Vital',
      description:
        "Grupo Inov9's first website: layout designed and validated in Figma, then built in WordPress with Elementor.",
    },
  },
  'grupo-rcr': {
    image: 'images/projects/rcr-showcase.jpg',
    pt: {
      title: 'Grupo RCR | Website + Blog, case de Robson Vital',
      description:
        'Site institucional e blog do Grupo RCR reconstruídos do zero em código moderno, com layout validado no Figma junto ao cliente.',
    },
    en: {
      title: 'Grupo RCR | Website + Blog, case by Robson Vital',
      description:
        "Grupo RCR's corporate website and blog rebuilt from scratch in modern code, with a layout validated in Figma together with the client.",
    },
  },
  'kwik-ledgers': {
    image: 'images/projects/kwik-ledgers-showcase.jpg',
    pt: {
      title: 'Kwik Ledgers | UX/UI, case de Robson Vital',
      description:
        'Product Design no Kwik Ledgers: novo onboarding guiado, design system e fluxos de documentos para clientes e contadores.',
    },
    en: {
      title: 'Kwik Ledgers | UX/UI, case by Robson Vital',
      description:
        'Product Design at Kwik Ledgers: a new guided onboarding, design system and document flows for clients and accountants.',
    },
  },
  'grupo-vikings': {
    image: 'images/projects/vikings-showcase.jpg',
    pt: {
      title: 'Grupo Vikings | Website multilíngue, case de Robson Vital',
      description:
        'Site bilíngue (PT/EN) do Grupo Vikings, desenvolvido do zero com abertura em vídeo para reforçar a escala da operação.',
    },
    en: {
      title: 'Grupo Vikings | Multilingual website, case by Robson Vital',
      description:
        "Grupo Vikings' bilingual (PT/EN) website, built from scratch with a video opening that conveys the scale of the operation.",
    },
  },
};
