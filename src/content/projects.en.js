const BASE_URL = import.meta.env.BASE_URL;

// English version of projects.pt.js — same keys (the tile's `data-name` in
// en/index.html), same media/URLs, translated copy only.
const ZALIEZA_PARTNER = {
  name: 'Zalieza',
  url: 'https://zalieza.com/',
  logo: {
    src: `${BASE_URL}images/logos/zalieza.svg`,
    alt: 'Zalieza logo',
  },
  text: 'Website built for a client of',
};

export const PROJECT_CONTENT = {
  Jumper: {
    partner: ZALIEZA_PARTNER,
    media: {
      src: `${BASE_URL}images/projects/jumper-showcase.webp`,
      fallback: `${BASE_URL}images/projects/jumper-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Home page of the new Jumper website open on a laptop and a smartphone, with the headline "Cuidamos da sua operação para que você cuide do seu negócio." (We take care of your operation so you can take care of your business.)',
    },
    url: 'https://jumperseg.com.br/',
    tags: ['GSAP', 'Scroll animations', 'Conversion copy'],
    sections: [
      {
        heading: 'The problem',
        text: 'Jumper, a group that integrates security, facilities and technology, had an old WordPress site: generic look, no content hierarchy and no structure designed to turn visits into leads. The project was run through Zalieza, the agency in charge of the account.',
      },
      {
        heading: 'What I did',
        text: 'I designed and built the site from scratch, without WordPress, using AI as a workflow accelerator but with every screen, animation and line of copy reviewed and adjusted by hand, so nothing looks "auto-generated". I implemented scroll-driven GSAP animations to guide visitors through the brand narrative, and rewrote the content section by section with a focus on conversion.',
      },
      {
        heading: 'Result',
        text: 'A site that loads fast and delivers fast, worthy of the operation Jumper represents, from asset security to the 24/7 control center, with a scroll experience that holds attention, leads to action and has an identity of its own.',
      },
    ],
  },
  'Grupo RCR': {
    partner: ZALIEZA_PARTNER,
    media: {
      src: `${BASE_URL}images/projects/rcr-showcase.webp`,
      fallback: `${BASE_URL}images/projects/rcr-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Home page of the new Grupo RCR website open on a laptop, with the headline "Cuidar de pessoas, Proteger patrimônios, Servir com excelência" (Caring for people, Protecting assets, Serving with excellence).',
    },
    url: 'http://gruporcr.com.br/',
    tags: ['Modern code (no WordPress)', 'WordPress (blog)', 'Conversion copy'],
    sections: [
      {
        heading: 'The problem',
        text: "Grupo RCR already had a website, but it didn't keep up with the company's moment — exponential growth in its field — and made the operation look smaller than it is. The project was run through Zalieza, the agency in charge of the account.",
      },
      {
        heading: 'What I did',
        text: 'I designed the layout in Figma and validated every screen with the client before writing any code. Only then did I rebuild the corporate site from scratch in modern code, without WordPress, around a clear narrative: "caring for people, protecting assets, serving with excellence". The blog stayed on WordPress, separate from the corporate side, so RCR\'s team can publish content easily.',
      },
      {
        heading: 'Result',
        text: "A digital presence worthy of Grupo RCR's growth, with a fast, modern corporate site and a blog that's easy for the team to maintain.",
      },
    ],
  },
  'Grupo Vikings': {
    partner: ZALIEZA_PARTNER,
    media: {
      src: `${BASE_URL}images/projects/vikings-showcase.webp`,
      fallback: `${BASE_URL}images/projects/vikings-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Home page of the new Grupo Vikings website open on a laptop and a smartphone, with the headline "Produtividade e atendimento de excelência em facilities e segurança." (Productivity and excellent service in facilities and security.)',
    },
    url: 'https://grupo-vikings.web-cf8.workers.dev/',
    tags: ['Modern code (no WordPress)', 'Hero video', 'PT/EN'],
    sections: [
      {
        heading: 'The problem',
        text: 'Grupo Vikings, a facilities and security company, already had a website, but it was old and out of step with the company\'s current operation. The project was run through Zalieza, the agency in charge of the account.',
      },
      {
        heading: 'What I did',
        text: "I built the whole site on my own, from scratch, with a video at the opening to give the first impression more impact. I set up the structure in two languages, Portuguese and English, to match the reach of the company's operation.",
      },
      {
        heading: 'Result',
        text: "A renewed, bilingual digital presence, with a video opening that communicates the scale of Grupo Vikings as soon as the site loads.",
      },
    ],
  },
  Inov9: {
    partner: ZALIEZA_PARTNER,
    media: {
      src: `${BASE_URL}images/projects/inov9-showcase.webp`,
      fallback: `${BASE_URL}images/projects/inov9-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Home page of the new Grupo Inov9 website open on a laptop, with the headline "Segurança e facilities que garantem a continuidade do seu negócio." (Security and facilities that ensure your business continuity.)',
    },
    url: 'https://grupoinov9.com.br/',
    tags: ['WordPress', 'Elementor', 'Visual identity'],
    sections: [
      {
        heading: 'The problem',
        text: "Grupo Inov9 — security, facilities and technology — didn't have a website yet. Without a digital presence, the company had no way to show visitors the stage it had already reached: a mature, well-structured operation. The project was run through Zalieza, the agency in charge of the account.",
      },
      {
        heading: 'What I did',
        text: 'I designed the entire site in Figma first and validated the project with the client before moving it to WordPress. Only then did I build the site in WordPress with Elementor, organizing the solutions, methodology and lines of business (facilities, asset security) into a clear structure, with a visual identity aligned to the brand.',
      },
      {
        heading: 'Result',
        text: "A new site that brought modernity to Inov9's digital presence and conveys, more faithfully, the stage the company is at today.",
      },
    ],
  },
  'Kwik Ledgers': {
    media: {
      src: `${BASE_URL}images/projects/kwik-ledgers-showcase.webp`,
      fallback: `${BASE_URL}images/projects/kwik-ledgers-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Kwik Ledgers sign-up screen open on a laptop, with person-type selection, address and contacts.',
    },
    tags: ['UX/UI Design', 'Research & Usability Testing', 'Design System'],
    sections: [
      {
        type: 'image',
        src: `${BASE_URL}images/projects/kwik-ledgers-overview.webp`,
        fallback: `${BASE_URL}images/projects/kwik-ledgers-overview.jpg`,
        width: 1374,
        height: 996,
        alt: 'Kwik Ledgers "Overview" dashboard, with bookkeeping status, bank accounts, profit and expenses.',
      },
      {
        heading: 'My role',
        text: 'Product Designer (UX/UI) at Kwik Ledgers, through Ambra, from January 2023 to June 2025. I worked end to end, from discovery to handoff, in partnership with development, marketing and business.',
      },
      {
        heading: 'Before',
        text: 'After signing up, the client landed straight on a dashboard with no guidance. They had to send documents so the accountant could start working, but didn\'t know which ones or where to begin. Many stopped there, and the accounting analysis stayed blocked waiting for information.',
      },
      {
        type: 'image',
        src: `${BASE_URL}images/projects/kwik-ledgers-profile.webp`,
        fallback: `${BASE_URL}images/projects/kwik-ledgers-profile.jpg`,
        width: 1280,
        height: 996,
        alt: 'Kwik Ledgers sign-up form, with type selection (individual/company), address and contacts.',
      },
      {
        heading: 'Design decisions',
        text: 'Step-by-step sign-up. I replaced the direct entry into the dashboard with a guided path that takes the client from sign-up to document submission.',
      },
      {
        text: 'Required and optional separated. The client knows exactly what is needed now and what can wait, without being scared off by a long list.',
      },
      {
        text: 'Complete later. Accounting documents aren\'t always at hand. Instead of blocking progress, the client can move on and come back once they have the file.',
      },
      {
        text: 'Ask the accountant for help. For an audience with no accounting knowledge, moments of doubt are inevitable. I placed the path to the accountant inside the flow itself, instead of the client giving up or opening a ticket.',
      },
      {
        type: 'image',
        src: `${BASE_URL}images/projects/kwik-ledgers-design-system.webp`,
        fallback: `${BASE_URL}images/projects/kwik-ledgers-design-system.jpg`,
        width: 1300,
        height: 880,
        alt: 'Kwik Ledgers design system color palette — background, primary, secondary, success, error, disabled and CTA, each with its hex code.',
      },
      {
        type: 'quote',
        text: '"I recommend hiring Robson. He ran research and redesigned the interface based on usability tests, which resulted in a smoother experience and a more satisfied, engaged user base."',
        author: 'Israel Zeferino',
        role: 'Senior Product Owner / Product Manager',
        avatar: {
          src: `${BASE_URL}images/projects/kwik-ledgers-israel-zeferino.webp`,
          fallback: `${BASE_URL}images/projects/kwik-ledgers-israel-zeferino.jpg`,
          alt: 'Portrait of Israel Zeferino',
        },
      },
      {
        heading: 'Document approval flow',
        text: 'The same document has two sides. The client uploads invoices and statements, and the file stays pending. The accountant reviews it and can approve, reject or comment.',
      },
      {
        text: 'I designed different views and states for each profile: the client needs to know where what they sent stands and what still needs fixing; the accountant needs to quickly find what is pending across many clients. The visual statuses (pending, approved, rejected) are the same on both sides, so both speak the same language.',
      },
      {
        type: 'image',
        src: `${BASE_URL}images/projects/kwik-ledgers-documents.webp`,
        fallback: `${BASE_URL}images/projects/kwik-ledgers-documents.jpg`,
        width: 1280,
        height: 886,
        alt: 'Kwik Ledgers document management screen, with upload status for EIN, articles of organization and proof of address.',
      },
      {
        heading: 'Result',
        text: 'With the new onboarding, users started completing the full path, from sign-up to document submission. Accountants started receiving documentation in a more organized way, which made the accounting analysis easier.',
      },
      {
        text: 'Cross-referencing Hotjar recordings, Google Analytics flows and follow-up with the first clients made it possible to prioritize changes based on observed friction points, not intuition.',
      },
    ],
  },
};
