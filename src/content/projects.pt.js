const BASE_URL = import.meta.env.BASE_URL;

// Selo "desenvolvido para cliente da Zalieza" (ver PROJECT_CONTENT/
// buildPartnerNote), reaproveitado nos projetos captados via agência —
// hoje Jumper, Grupo RCR, Grupo Vikings e Inov9.
const ZALIEZA_PARTNER = {
  name: 'Zalieza',
  url: 'https://zalieza.com/',
  logo: {
    src: `${BASE_URL}images/logos/zalieza.svg`,
    alt: 'Logo da Zalieza',
  },
  text: 'Site desenvolvido para cliente da',
};

export const PROJECT_CONTENT = {
  Jumper: {
    partner: ZALIEZA_PARTNER,
    media: {
      // Gerado a partir do print original (~1.8MB) via sharp-cli,
      // redimensionado pra 2000px de largura — ver public/images/projects.
      src: `${BASE_URL}images/projects/jumper-showcase.webp`,
      fallback: `${BASE_URL}images/projects/jumper-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Home do novo site da Jumper aberta em um notebook e um smartphone, com o título "Cuidamos da sua operação para que você cuide do seu negócio."',
    },
    url: 'https://jumperseg.com.br/',
    tags: ['GSAP', 'Animações de scroll', 'Copy de conversão'],
    sections: [
      {
        heading: 'O problema',
        text: 'A Jumper, grupo que integra segurança, facilities e tecnologia, tinha um site antigo em WordPress: visual genérico, sem hierarquia de conteúdo e nenhuma estrutura pensada para converter visita em contato. O projeto foi conduzido via Zalieza, agência responsável pela conta.',
      },
      {
        heading: 'O que eu fiz',
        text: 'Projetei e desenvolvi o site do zero, sem WordPress, usando IA como acelerador de fluxo, mas com cada tela, animação e linha de copy revisada e ajustada manualmente, sem deixar nada com "cara de gerado automaticamente". Implementei animações em GSAP orientadas a scroll para guiar o visitante pela narrativa da marca, e reescrevi o conteúdo seção por seção com foco em conversão.',
      },
      {
        heading: 'Resultado',
        text: 'Um site rápido para carregar e rápido para entregar, à altura da operação que a Jumper representa, da segurança patrimonial ao centro de controle 24/7, com uma experiência de scroll que prende atenção, conduz à ação e tem identidade própria.',
      },
    ],
  },
  'Grupo RCR': {
    partner: ZALIEZA_PARTNER,
    media: {
      // Gerado a partir do print original (~1.4MB) via sharp-cli,
      // redimensionado pra 2000px de largura — ver public/images/projects.
      src: `${BASE_URL}images/projects/rcr-showcase.webp`,
      fallback: `${BASE_URL}images/projects/rcr-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Home do novo site do Grupo RCR aberta em um notebook, com o título "Cuidar de pessoas, Proteger patrimônios, Servir com excelência".',
    },
    url: 'http://gruporcr.com.br/',
    tags: ['Código moderno (sem WordPress)', 'WordPress (blog)', 'Copy de conversão'],
    sections: [
      {
        heading: 'O problema',
        text: 'O Grupo RCR já tinha um site, mas ele não acompanhava o momento da empresa, um crescimento exponencial na sua área, e deixava a operação parecer menor do que é. O projeto foi conduzido via Zalieza, agência responsável pela conta.',
      },
      {
        heading: 'O que eu fiz',
        text: 'Desenhei o layout no Figma e validei cada tela com o cliente antes de sair codando. Só depois disso reconstruí o site institucional do zero em código moderno, sem WordPress, em torno de uma narrativa clara: "cuidar de pessoas, proteger patrimônios, servir com excelência". O blog ficou em WordPress, separado da parte institucional, pra facilitar a publicação de conteúdo pela equipe da RCR.',
      },
      {
        heading: 'Resultado',
        text: 'Uma presença digital à altura do crescimento do Grupo RCR, com um site institucional rápido e moderno e um blog fácil de manter para a própria equipe.',
      },
    ],
  },
  'Grupo Vikings': {
    partner: ZALIEZA_PARTNER,
    media: {
      // Mockup em laptop gerado a partir do print original, redimensionado
      // pra 2000px de largura via sharp-cli — ver public/images/projects.
      src: `${BASE_URL}images/projects/vikings-showcase.webp`,
      fallback: `${BASE_URL}images/projects/vikings-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Home do novo site do Grupo Vikings aberta em um notebook e um smartphone, com o título "Produtividade e atendimento de excelência em facilities e segurança."',
    },
    url: 'https://grupo-vikings.web-cf8.workers.dev/',
    tags: ['Código moderno (sem WordPress)', 'Vídeo no hero', 'PT/EN'],
    sections: [
      {
        heading: 'O problema',
        text: 'O Grupo Vikings, empresa de facilities e segurança, já tinha um site, mas antigo e defasado em relação ao momento da operação. O projeto foi conduzido via Zalieza, agência responsável pela conta.',
      },
      {
        heading: 'O que eu fiz',
        text: 'Desenvolvi o site inteiro sozinho, do zero, com um vídeo na abertura pra dar mais impacto à primeira impressão. Montei a estrutura em duas línguas, português e inglês, pra atender o alcance da operação da empresa.',
      },
      {
        heading: 'Resultado',
        text: 'Uma presença digital renovada e bilíngue, com uma abertura em vídeo que já comunica a escala do Grupo Vikings assim que o site carrega.',
      },
    ],
  },
  Inov9: {
    partner: ZALIEZA_PARTNER,
    media: {
      // Gerado a partir do print original via sharp-cli, redimensionado
      // pra 2000px de largura — ver public/images/projects.
      src: `${BASE_URL}images/projects/inov9-showcase.webp`,
      fallback: `${BASE_URL}images/projects/inov9-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Home do novo site do Grupo Inov9 aberta em um notebook, com o título "Segurança e facilities que garantem a continuidade do seu negócio."',
    },
    url: 'https://grupoinov9.com.br/',
    tags: ['WordPress', 'Elementor', 'Identidade visual'],
    sections: [
      {
        heading: 'O problema',
        text: 'O Grupo Inov9, segurança, facilities e tecnologia, ainda não tinha site. Sem presença digital, a empresa não tinha como transmitir pra quem chegava até ela o ponto em que já estava: uma operação madura e estruturada. O projeto foi conduzido via Zalieza, agência responsável pela conta.',
      },
      {
        heading: 'O que eu fiz',
        text: 'Desenhei o site inteiro no Figma primeiro e validei o projeto com o cliente antes de subir pro WordPress. Só depois construí o site em WordPress com Elementor, organizando as soluções, a metodologia e as frentes de atuação (facilities, segurança patrimonial) numa estrutura clara, com identidade visual alinhada à marca.',
      },
      {
        heading: 'Resultado',
        text: 'Um site novo que trouxe modernidade pra presença digital da Inov9 e passa, com mais fidelidade, o estágio em que a empresa está hoje.',
      },
    ],
  },
  'Kwik Ledgers': {
    media: {
      // Mockup em laptop gerado a partir da tela de cadastro, redimensionado
      // pra 2000px de largura via sharp-cli — ver public/images/projects.
      src: `${BASE_URL}images/projects/kwik-ledgers-showcase.webp`,
      fallback: `${BASE_URL}images/projects/kwik-ledgers-showcase.jpg`,
      width: 2000,
      height: 1116,
      alt: 'Tela de cadastro do Kwik Ledgers aberta em um laptop, com seleção de tipo de pessoa, endereço e contatos.',
    },
    tags: ['UX/UI Design', 'Pesquisa & Testes de Usabilidade', 'Design System'],
    // Sequência intercalada: imagem, texto, imagem, texto, imagem, citação
    // de cliente, texto, imagem, texto — cada item cai num tipo diferente
    // dentro de renderProjectBody (default 'text', mais 'image' e 'quote').
    // Conteúdo alinhado ao case study completo em
    // Desktop/KL/Portfolio - KwikLedgers/case-study-kwikledgers.md — aqui
    // condensado pro formato mais curto do overlay.
    sections: [
      {
        type: 'image',
        // Era a imagem de capa original — trocada pelo mockup em laptop
        // acima (`content.media`) e reaproveitada aqui, logo na abertura
        // do conteúdo.
        src: `${BASE_URL}images/projects/kwik-ledgers-overview.webp`,
        fallback: `${BASE_URL}images/projects/kwik-ledgers-overview.jpg`,
        width: 1374,
        height: 996,
        alt: 'Painel "Overview" do Kwik Ledgers, com status da contabilidade, contas bancárias, lucro e despesas.',
      },
      {
        heading: 'Meu papel',
        text: 'Product Designer (UX/UI) no Kwik Ledgers, pela Ambra, de janeiro de 2023 a junho de 2025. Atuei de ponta a ponta, do discovery ao handoff, em parceria com desenvolvimento, marketing e negócios.',
      },
      {
        heading: 'Antes',
        text: 'Depois do cadastro, o cliente caía direto em um dashboard sem nenhuma orientação. Ele precisava enviar documentos para o contador começar a trabalhar, mas não sabia quais, nem por onde começar. Muitos paravam ali, e a análise contábil ficava travada esperando informação.',
      },
      {
        type: 'image',
        src: `${BASE_URL}images/projects/kwik-ledgers-profile.webp`,
        fallback: `${BASE_URL}images/projects/kwik-ledgers-profile.jpg`,
        width: 1280,
        height: 996,
        alt: 'Formulário de cadastro do Kwik Ledgers, com seleção de tipo (pessoa física/jurídica), endereço e contatos.',
      },
      {
        heading: 'Decisões de design',
        text: 'Cadastro por etapas. Troquei a entrada no dashboard por um percurso guiado, que leva o cliente do cadastro até o envio dos documentos.',
      },
      {
        text: 'Obrigatórios e opcionais separados. O cliente sabe exatamente o que precisa agora e o que pode ficar para depois, sem se assustar com uma lista longa.',
      },
      {
        text: 'Completar depois. Documento contábil nem sempre está à mão. Em vez de bloquear o avanço, o cliente pode seguir e voltar quando tiver o arquivo.',
      },
      {
        text: 'Pedir ajuda ao contador. Para um público sem conhecimento contábil, o ponto de dúvida é inevitável. Deixei o caminho para o contador dentro do próprio fluxo, em vez de o cliente abandonar ou abrir um chamado.',
      },
      {
        type: 'image',
        src: `${BASE_URL}images/projects/kwik-ledgers-design-system.webp`,
        fallback: `${BASE_URL}images/projects/kwik-ledgers-design-system.jpg`,
        width: 1300,
        height: 880,
        alt: 'Paleta de cores do design system do Kwik Ledgers — background, primária, secundária, sucesso, erro, desabilitado e CTA, cada uma com o código hexadecimal.',
      },
      {
        type: 'quote',
        text: '"Recomendando a contratação do Robson, ele conduziu pesquisas e redesenhou a interface com base em testes de usabilidade, o que resultou em uma experiência mais fluida e em uma base de usuários mais satisfeita e engajada."',
        author: 'Israel Zeferino',
        role: 'Sênior Product Owner / Product Manager',
        avatar: {
          src: `${BASE_URL}images/projects/kwik-ledgers-israel-zeferino.webp`,
          fallback: `${BASE_URL}images/projects/kwik-ledgers-israel-zeferino.jpg`,
          alt: 'Retrato de Israel Zeferino',
        },
      },
      {
        heading: 'Fluxo de aprovação de documentos',
        text: 'O mesmo documento tem dois lados. O cliente envia notas fiscais e extratos, e o arquivo fica pendente. O contador analisa e pode aprovar, recusar ou comentar.',
      },
      {
        text: 'Desenhei visões e estados diferentes para cada perfil: o cliente precisa saber em que pé está o que enviou e o que falta corrigir; o contador precisa encontrar rápido o que está pendente entre vários clientes. Os status visuais (pendente, aprovado, recusado) são os mesmos nos dois lados, para que os dois falem a mesma língua.',
      },
      {
        type: 'image',
        src: `${BASE_URL}images/projects/kwik-ledgers-documents.webp`,
        fallback: `${BASE_URL}images/projects/kwik-ledgers-documents.jpg`,
        width: 1280,
        height: 886,
        alt: 'Tela de gestão de documentos do Kwik Ledgers, com status de envio de EIN, contrato social e comprovante de endereço.',
      },
      {
        heading: 'Resultado',
        text: 'Com o novo onboarding, os usuários passaram a concluir o percurso completo, do cadastro ao envio dos documentos. Os contadores passaram a receber a documentação de forma mais organizada, o que facilitou a análise contábil.',
      },
      {
        text: 'Cruzar gravações do Hotjar, fluxos do Google Analytics e o acompanhamento dos primeiros clientes permitiu priorizar mudanças com base em pontos de atrito observados, e não em intuição.',
      },
    ],
  },
};
