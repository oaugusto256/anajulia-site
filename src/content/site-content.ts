/**
 * site-content.ts
 * ─────────────────────────────────────────────────────────────────
 * Conteúdo estruturado da landing page de Ana Julia Vognach.
 * Fonte de verdade textual + decisões de layout (desktop/mobile).
 *
 * Cada seção exporta:
 *   - copy:    todo o conteúdo textual (títulos, corpo, CTAs, listas)
 *   - layout:  decisões de composição (colunas, ordem, alinhamento)
 *   - notes:   observações de formatação especial
 *
 * Convenções:
 *   - Itálico de destaque é marcado com {italic: "..."} ou trechos
 *     entre asteriscos no campo dedicado.
 *   - Mensagens de WhatsApp já vêm URL-encoded em CTA.href.
 *   - Cores são tokens nomeados, não hex (vide design system).
 * ─────────────────────────────────────────────────────────────────
 */

// ────────────────────────────────────────────────────────────────
// TIPOS
// ────────────────────────────────────────────────────────────────

export type CTA = {
  label: string;
  href: string;
  variant: "primary" | "ghost" | "text" | "icon";
  /** Mensagem pré-preenchida no WhatsApp (texto puro, antes de encode) */
  whatsappMessage?: string;
};

export type Layout = {
  /** Número de colunas no desktop (≥980px) */
  desktopColumns: 1 | 2 | 3 | 4;
  /** Número de colunas no mobile (≤760px) */
  mobileColumns: 1 | 2 | 3;
  /** Ordem visual no mobile (override do DOM) */
  mobileOrder?: string[];
  /** Posicionamento da imagem principal (se houver) */
  imagePosition?: "left" | "right" | "background" | "above-text" | "below-text" | "none";
  /** Alinhamento de texto principal */
  textAlign?: "left" | "center" | "right";
  /** Cor de fundo via token */
  background?: "off-white" | "off-white-2" | "oliva" | "ink";
  /** Borda superior (linha divisória sutil) */
  topDivider?: boolean;
};

// ────────────────────────────────────────────────────────────────
// META · página & SEO
// ────────────────────────────────────────────────────────────────

export const meta = {
  language: "pt-BR",
  title: "Ana Julia Vognach · Psicóloga Clínica",
  description:
    "Psicoterapia para adultos com foco em burnout, maternidade, luto e saúde mental no trabalho. Atendimento online, CRP 12/30269.",
  keywords: [
    "psicóloga online",
    "psicoterapia",
    "burnout",
    "saúde mental",
    "psicoterapia para mães",
    "maternidade",
    "luto",
    "psicologia clínica",
    "CRP 12/30269",
    "Florianópolis",
    "Sul da Ilha",
    "atendimento online",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Ana Julia Vognach",
  },
  fonts: {
    serif: "Playfair Display",
    italic: "Cormorant Garamond",
    sans: "Inter",
  },
  colorTokens: {
    "off-white": "#FDFBF7",
    "off-white-2": "#F6F2EA",
    ink: "#111111",
    oliva: "#4A5D4E",
    "oliva-light": "#7B8F7F",
    "oliva-soft": "#E8E9E1",
    cinza: "#555555",
    linhas: "#E5E5E5",
  },
};

// ────────────────────────────────────────────────────────────────
// BRAND · identidade
// ────────────────────────────────────────────────────────────────

export const brand = {
  kicker: "Psicóloga", // pequeno, italic, oliva
  name: "Ana Julia Vognach", // serif Playfair
  sub: "CRP 12/30269", // small caps no header
  fullTitle: "Ana Julia Vognach · Psicóloga Clínica",
  crp: "CRP/SC 12/30269",
  symbol: "Ψ", // psi grego — usado no selo circular do header
  contact: {
    whatsapp: {
      raw: "5551982831876",
      display: "(51) 98283-1876",
      href: "https://wa.me/5551982831876",
    },
    email: "anajuliavognach93@gmail.com",
    instagram: {
      handle: "@psicoanavognach",
      href: "https://instagram.com/psicoanavognach",
    },
  },
};

// ────────────────────────────────────────────────────────────────
// NAV · header + drawer mobile
// ────────────────────────────────────────────────────────────────

export const nav = {
  links: [
    { label: "Trajetória", href: "#sobre" },
    { label: "Abordagem", href: "#abordagem" },
    { label: "Serviços", href: "#servicos" },
    { label: "Dúvidas", href: "#faq" },
    { label: "Contato", href: "#contato" },
  ],
  cta: {
    label: "Agendar conversa",
    href: "https://wa.me/5551982831876?text=Ol%C3%A1%2C%20Ana%20Julia.%20Vi%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20conversa%20inicial.",
    variant: "primary",
    whatsappMessage: "Olá, Ana Julia. Vi seu site e gostaria de agendar uma conversa inicial.",
  } satisfies CTA,
  layout: {
    desktopColumns: 3, // brand | links | cta
    mobileColumns: 2, // brand | burger
    textAlign: "left",
    background: "off-white",
    notes: [
      "Sticky no topo, com blur + tint do off-white",
      "Border-bottom aparece após scroll",
      "Drawer mobile cobre tela inteira, com fade vertical",
      "Drawer respeita env(safe-area-inset-top) para iPhones com notch",
    ],
  } as Layout & { notes: string[] },
};

// ────────────────────────────────────────────────────────────────
// 1 · HERO
// ────────────────────────────────────────────────────────────────

export const hero = {
  eyebrow: "Psicologia Clínica",
  title: {
    plain: "Escuta profunda, suporte técnico e emocional para a sua",
    italic: "saúde mental.", // Playfair italic, cor oliva, mesmo tamanho do título
  },
  /** Texto plano para SEO/SSR: */
  titlePlain: "Escuta profunda, suporte técnico e emocional para a sua saúde mental.",
  subtitle:
    "Para quem busca segurança e sentido diante das exigências da vida moderna, do trabalho e da parentalidade.",
  cta: {
    label: "Agendar conversa inicial",
    href: "https://wa.me/5551982831876?text=Ol%C3%A1%2C%20Ana%20Julia.%20Vi%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20conversa%20inicial.",
    variant: "primary",
    whatsappMessage: "Olá, Ana Julia. Vi seu site e gostaria de agendar uma conversa inicial.",
  } satisfies CTA,
  photo: {
    src: "fotos/IMG_8209.jpg",
    alt: "Retrato de Ana Julia Vognach, psicóloga clínica",
    objectPosition: "center 30%",
  },
  stamp: {
    /** Selo circular sobreposto à foto (canto inferior-esquerdo) */
    small: "Desde 2018",
    line1: "Cuidado em",
    line2: "saúde mental",
  },
  metrics: [
    { value: "5+", label: "anos em saúde mental corporativa" },
    { value: "CRP 12/30269", label: "registro ativo no Conselho" },
    { value: "100%", label: "online · de onde você estiver" },
  ],
  layout: {
    desktopColumns: 2, // texto à esquerda · foto à direita
    mobileColumns: 1,
    mobileOrder: [
      "photo", // foto primeiro — vínculo imediato com a terapeuta
      "eyebrow",
      "title",
      "subtitle",
      "cta", // CTA centralizado no mobile
      "metrics", // 3 colunas lado a lado abaixo
    ],
    imagePosition: "right",
    textAlign: "left",
    background: "off-white",
    notes: [
      "Métricas no desktop aparecem abaixo do CTA, com borda-top divisória",
      "Métricas no mobile vão para baixo da foto, em 3 colunas",
      "Título usa Playfair 500; itálico em Cormorant não — itálico é Playfair italic",
      "Foto tem aspect 4/5 com selo circular ‘Desde 2018’ sobreposto",
      "No mobile o selo encolhe (80px) e fica próximo ao canto",
    ],
  } as Layout & { notes: string[] },
};

// ────────────────────────────────────────────────────────────────
// 2 · SUPPORT (pergunta-âncora + 3 frentes)
// ────────────────────────────────────────────────────────────────

export const support = {
  pullQuote:
    "Você sente que está tentando equilibrar múltiplos papéis, mas vive sob uma sensação constante de esgotamento ou fragmentação?",
  intro:
    "As pressões do trabalho não terminam quando você chega em casa, e os desafios da parentalidade reverberam na sua carreira. Minha atuação oferece uma visão sistêmica para que você não precise atravessar esses processos sozinha(o), unindo o rigor técnico ao acolhimento necessário para:",
  bullets: [
    {
      strong: "Manejar o estresse",
      rest: " e prevenir o esgotamento profissional (Burnout).",
    },
    {
      strong: "Lidar com a ambivalência",
      rest: " entre carreira, identidade e maternidade.",
    },
    {
      strong: "Atravessar processos de luto",
      rest: " e transições de vida com suporte especializado.",
    },
  ],
  layout: {
    desktopColumns: 2, // pull-quote esquerda · texto+lista direita
    mobileColumns: 1,
    textAlign: "left",
    background: "off-white",
    topDivider: true,
    notes: [
      "Pull-quote em Cormorant italic 300, 1.6–2.4rem",
      "Aspas curvas decorativas (“) renderizadas grandes acima do texto, em oliva",
      "Lista usa bullets pontuais (6px, oliva) — sem numeração",
      "Cada item tem um <strong> seguido de texto regular",
    ],
  } as Layout & { notes: string[] },
};

// ────────────────────────────────────────────────────────────────
// 3 · ABOUT (Quem é Ana Julia + trajetória colapsada)
// ────────────────────────────────────────────────────────────────

export const about = {
  eyebrow: "Quem é Ana Julia",
  title: "Psicóloga, especialista em saúde mental, mãe...",
  lead: "Unindo a densidade da Residência Hospitalar a mais de 5 anos de experiência na gestão de saúde mental corporativa, ajudo adultos a (re)conquistarem segurança emocional para viver com mais consciência e leveza.",
  body: "Minha prática é pautada no acolhimento genuíno e na escuta ativa, integrando o rigor técnico a orientações práticas para a vida real. Como mãe e profissional, compreendo as pressões que a carreira e a parentalidade impõem, oferecendo o suporte necessário para que você atravesse seus desafios com clareza.",
  expandToggle: {
    closedLabel: "Conheça mais sobre a minha trajetória",
    openLabel: "Recolher trajetória",
  },
  trajectory: {
    intro:
      "Olá, eu sou a Ana Julia Vognach. Sou psicóloga clínica e especialista em compreender as conexões profundas entre a vida pessoal e as exigências do trabalho.",
    sections: [
      {
        title: "Do hospital ao corporativo",
        body: [
          "Minha jornada na Psicologia foi construída em cenários de alta complexidade. Por meio da Residência Multiprofissional, atuei em ambientes hospitalares e acompanhei de perto os ciclos de vida, do nascimento ao luto.",
          "Essas experiências lapidaram o meu olhar e a minha escuta: aprendi que, mesmo nas situações mais difíceis, é possível construir caminhos de dignidade e sentido.",
          "Ao longo de 5 anos, mergulhei na área da Saúde Mental do Trabalhador. Atuei em grandes empresas, geri projetos, ações em saúde e equipes de psicologia. Ali, compreendi na prática como as pressões por produtividade e as dinâmicas de trabalho podem impactar a nossa saúde mental e a nossa identidade pessoal e profissional.",
        ],
      },
      {
        title: "A travessia entre a maternidade e a clínica",
        body: [
          "Hoje, além da minha bagagem técnica, trago comigo a experiência da maternidade. Vivi na pele a ambivalência de assumir um cargo de gestão enquanto atravessava a licença-maternidade e, ao mesmo tempo, aprendia a ser mãe.",
          "Foi nesse lugar de transformações que encontrei a coragem de fazer uma escolha: a de deixar a gestão corporativa e redirecionar minha energia para a minha clínica e a maternidade. Uma escolha pautada pelo que considero essencial na Psicologia: o respeito ao tempo de cada processo e aos afetos que nos sustentam.",
          "Conheço o medo do desconhecido, a ansiedade de equilibrar múltiplos papéis e o desafio de redescobrir quem somos quando a vida ganha novos contornos. Hoje, utilizo toda essa bagagem técnica e humana para oferecer um espaço onde a sua história é vista de forma integral. Deixei a gestão corporativa para me dedicar à clínica justamente por acreditar que cada travessia merece um tempo de cuidado e respeito.",
        ],
        cta: {
          label: "Agendar uma conversa comigo",
          href: "https://wa.me/5551982831876?text=Ol%C3%A1%2C%20Ana%20Julia.%20Vi%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20conversa%20inicial.",
          variant: "ghost",
          whatsappMessage:
            "Olá, Ana Julia. Vi seu site e gostaria de agendar uma conversa inicial.",
        } satisfies CTA,
      },
    ],
  },
  photo: {
    src: "fotos/IMG_8114.jpg",
    alt: "Ana Julia em ambiente de atendimento, com um sorriso acolhedor",
    objectPosition: "center 25%",
  },
  layout: {
    desktopColumns: 2, // foto esquerda · texto direita (0.85fr · 1.15fr)
    mobileColumns: 1,
    mobileOrder: ["photo", "eyebrow", "title", "lead", "body", "toggle", "trajectory"],
    imagePosition: "left",
    textAlign: "left",
    background: "off-white-2",
    topDivider: true,
    notes: [
      "Lead é Cormorant italic 1.05–1.2rem, ink color (não cinza)",
      "Toggle ‘Conheça mais’ é botão text-only com plus-icon que gira 45° quando aberto",
      "Trajetória expande via max-height transition (0 → 2400px em 0.55s)",
      "Capítulos NÃO usam kickers ‘Capítulo um/dois’ — apenas título + corpo",
      "Trajetória CTA fica ao final do segundo capítulo, variant ghost",
    ],
  } as Layout & { notes: string[] },
};

// ────────────────────────────────────────────────────────────────
// 4 · APPROACH (Como eu trabalho)
// ────────────────────────────────────────────────────────────────

export const approach = {
  eyebrow: "Como eu trabalho",
  title: "Acolhimento genuíno, escuta ativa e orientações práticas.",
  body: [
    "Defendo que a psicoterapia não deve ser apenas um lugar de fala, mas um espaço de construção conjunta. Minha prática une a densidade clínica com acolhimento genuíno, escuta ativa e orientações práticas.",
    "Seja para lidar com o esgotamento profissional, elaborar um luto ou encontrar o seu lugar em uma nova fase da vida, estou aqui para caminharmos juntos em busca de mais leveza, presença e sentido.",
  ],
  cta: {
    label: "Agendar uma conversa comigo",
    href: "https://wa.me/5551982831876?text=Ol%C3%A1%2C%20Ana%20Julia.%20Vi%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20conversa%20inicial.",
    variant: "primary",
    whatsappMessage: "Olá, Ana Julia. Vi seu site e gostaria de agendar uma conversa inicial.",
  } satisfies CTA,
  layout: {
    desktopColumns: 1, // bloco único centralizado, max-width 780px
    mobileColumns: 1,
    textAlign: "center",
    background: "off-white",
    topDivider: true,
    notes: [
      "Bloco centralizado horizontalmente (max-width: 780px, margin auto)",
      "Não tem ícone/glyph acima do eyebrow (removido)",
      "Título limitado a ~16ch, balance text-wrap",
    ],
  } as Layout & { notes: string[] },
};

// ────────────────────────────────────────────────────────────────
// 5 · SERVICES · accordion
// ────────────────────────────────────────────────────────────────

export const services = {
  eyebrow: "Serviços",
  title: "Sete frentes de cuidado.",
  intro:
    "Atendimento clínico individual, online, com o mesmo rigor ético e profundidade do presencial. Cada serviço pode ser combinado de forma personalizada, no seu tempo, dentro da nossa relação terapêutica.",
  items: [
    {
      id: "atendimento-online",
      icon: "monitor", // desktop / computador
      title: "Atendimento Psicológico Online",
      body: "Psicoterapia individual para adultos realizada de forma remota, com o mesmo rigor ético e profundidade do presencial, oferecendo flexibilidade e segurança para o cuidado com a saúde mental onde quer que você esteja.",
    },
    {
      id: "psicoterapia-adultos",
      icon: "person", // silhueta de pessoa única
      title: "Psicoterapia para Adultos",
      body: "Atendimento clínico individual com foco em suporte emocional, autoconhecimento e no manejo de questões fundamentais da vida, como ansiedade, estresse e conflitos pessoais. Um espaço seguro para desenvolver segurança emocional e clareza diante de decisões importantes.",
    },
    {
      id: "clinica-do-trabalho",
      icon: "briefcase", // pasta com alça
      title: "Clínica do Trabalho e Saúde Mental",
      body: "Atendimento especializado nos impactos do trabalho na saúde mental. Foco no acolhimento de sofrimentos relacionados a exigências, pressões e conflitos no ambiente de trabalho, visando a prevenção do adoecimento e o fortalecimento do bem-estar emocional do profissional.",
    },
    {
      id: "burnout",
      icon: "person-fatigue", // pessoa com sinais de exaustão acima da cabeça
      title: "Acompanhamento em Burnout",
      body: "Intervenção clínica especializada para o esgotamento profissional (Burnout). Trabalho direcionado à recuperação da energia vital, manejo do estresse crônico e construção de novas formas de se posicionar diante das demandas profissionais, respeitando os limites da saúde psíquica.",
    },
    {
      id: "psicoterapia-maes",
      icon: "person-with-child", // adulto segurando criança no colo
      title: "Psicoterapia para Mães",
      body: "Espaço dedicado às mulheres na travessia da maternidade, desde a gestação até o retorno ao trabalho pós-licença. Foco nos desafios da nova identidade, na ambivalência dos sentimentos e na busca por equilíbrio entre os múltiplos papéis (mãe, mulher e profissional).",
    },
    {
      id: "luto-transicoes",
      icon: "horizon", // ondas/horizonte com pequena luz
      title: "Luto e Transições de Vida",
      body: "Suporte especializado para pessoas em processos de perda, luto ou grandes mudanças de vida. Através de uma escuta aprofundada vinda da experiência hospitalar, auxilio na elaboração da dor e na ressignificação da trajetória pessoal diante de crises e rupturas.",
    },
    {
      id: "saude-mental-empresas",
      icon: "clipboard", // prancheta corporativa
      title: "Saúde Mental no Trabalho — Empresas e Instituições",
      body: "Palestras, Workshops e Consultoria em Saúde Mental. O foco é humanizar as relações de trabalho e prevenir o adoecimento psíquico dos indivíduos e organizações.",
    },
  ],
  layout: {
    desktopColumns: 2, // head: eyebrow+título esquerda · intro direita
    mobileColumns: 1,
    textAlign: "left",
    background: "off-white-2",
    topDivider: true,
    notes: [
      "Accordion com apenas 1 item aberto por vez",
      "Cada item: ícone outline oliva (28px) + título serif + chevron (+)",
      "Numeração 01–07 foi REMOVIDA da lista",
      "Não há CTA ao final da seção",
      "Animação suave via grid-template-rows 0fr → 1fr",
    ],
  } as Layout & { notes: string[] },
};

// ────────────────────────────────────────────────────────────────
// 6 · REVIEWS (Google · estático)
// ────────────────────────────────────────────────────────────────

export const reviews = {
  eyebrow: "O que dizem sobre o meu acompanhamento",
  rating: "5,0",
  stars: 5,
  source: "Avaliações Google",
  layout: {
    desktopColumns: 1, // centralizado
    mobileColumns: 1,
    textAlign: "center",
    background: "off-white",
    topDivider: true,
    notes: [
      "Bloco centralizado, max-width 720px",
      "Nota grande em Playfair (3–5rem)",
      "5 estrelas filled em oliva",
      "Badge ‘Avaliações Google’ usa SVG colorido do logo Google",
      "Frase ‘Uma escuta que constrói…’ foi REMOVIDA",
    ],
  } as Layout & { notes: string[] },
};

// ────────────────────────────────────────────────────────────────
// 7 · MISSION
// ────────────────────────────────────────────────────────────────

export const mission = {
  eyebrow: "Minha Missão",
  /** Renderizar entre aspas curvas, em Cormorant italic, sobre fundo oliva */
  quote:
    "Minha missão é oferecer o suporte técnico e humano necessário para que você possa atravessar e lidar com os seus desafios com segurança. Através de uma escuta ativa e orientações práticas, ajudo você a fazer escolhas conscientes e a (re)conquistar sua clareza emocional em todas as esferas da vida.",
  layout: {
    desktopColumns: 1, // sem cartão lateral (removido a pedido)
    mobileColumns: 1,
    textAlign: "left", // eyebrow esquerda
    background: "oliva",
    topDivider: false,
    notes: [
      "Fundo verde-oliva sólido, texto em off-white",
      "Eyebrow alinhado à ESQUERDA",
      "Citação em itálico, centralizada APENAS no mobile",
      "Aspas curvas (“ ”) integradas no próprio texto",
      "Mission-card lateral (foco/modalidade/formação/registro) foi REMOVIDA",
      "Sem CTA — fechamento emocional",
      "Cormorant Garamond italic 300, line-height 1.35, font-size 1.4–2rem",
    ],
  } as Layout & { notes: string[] },
};

// ────────────────────────────────────────────────────────────────
// 8 · FAQ
// ────────────────────────────────────────────────────────────────

export const faq = {
  eyebrow: "Dúvidas Frequentes",
  items: [
    {
      id: "o-que-e",
      question: "O que é psicoterapia e será que eu preciso?",
      answer:
        "A psicoterapia é um espaço de acolhimento que serve para todas as pessoas; não precisa existir um “problema” para iniciar. É um espaço para conhecer mais sobre si, se entender e aprender a se autorregular para viver com mais consciência, presença e leveza.",
    },
    {
      id: "como-funciona-online",
      question: "Como funciona o atendimento psicológico online?",
      answer:
        "A psicoterapia online é uma excelente forma de otimização do tempo. Você realiza de onde desejar, desde que esteja em um ambiente silencioso, privativo e seguro. O atendimento ocorre via chamada de vídeo através de um link seguro enviado previamente. É simples, ético e eficaz.",
    },
    {
      id: "pagamento",
      question: "Como é feito o pagamento?",
      answer:
        "O pagamento é realizado via PIX ou transferência bancária. Trabalho com modalidades por sessão ou pacotes, combinados em nossa primeira conversa. Entrego recibos para que você possa solicitar reembolso no seu plano de saúde, caso ele ofereça essa modalidade.",
    },
    {
      id: "conversa-antes",
      question: "Podemos conversar antes de agendar?",
      answer:
        "Sim. Ofereço uma breve conversa inicial sem compromisso. Esse é um momento para você me conhecer, tirar dúvidas e sentir se o meu modo de trabalho ressoa com o que você busca.",
    },
    {
      id: "primeiro-encontro",
      question: "O que esperar do nosso primeiro encontro?",
      answer:
        "O foco é o acolhimento. Não há roteiro rígido ou pressão para “saber por onde começar”. É um espaço para nos conhecermos e entendermos como posso te acompanhar nessa jornada.",
    },
  ],
  cta: {
    label: "Tenho uma dúvida específica",
    href: "https://wa.me/5551982831876?text=Ol%C3%A1%2C%20Ana%20Julia.%20Vi%20seu%20site%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20como%20funciona%20o%20seu%20acompanhamento%20antes%20de%20agendar.",
    variant: "ghost",
    whatsappMessage:
      "Olá, Ana Julia. Vi seu site e gostaria de tirar uma dúvida sobre como funciona o seu acompanhamento antes de agendar.",
  } satisfies CTA,
  layout: {
    desktopColumns: 1, // accordion full-width abaixo do eyebrow
    mobileColumns: 1,
    textAlign: "left",
    background: "off-white",
    topDivider: true,
    notes: [
      "Título ‘Antes de marcar…’ e parágrafo introdutório foram REMOVIDOS",
      "Accordion com 1 item aberto por vez",
      "Pergunta em Playfair 500, resposta em Inter regular",
      "Chevron é ícone (+) que rotaciona 45° quando aberto",
      "CTA ghost centralizado abaixo da lista",
    ],
  } as Layout & { notes: string[] },
};

// ────────────────────────────────────────────────────────────────
// 9 · FOOTER
// ────────────────────────────────────────────────────────────────

export const footer = {
  brand: {
    kicker: "Psicóloga",
    name: "Ana Julia Vognach",
    sub: "CRP 12/30269",
    /** Alinhamento centralizado (mudança recente — sem texto descritivo abaixo) */
  },
  columns: [
    {
      title: "Contato",
      links: [
        {
          icon: "whatsapp",
          label: "WhatsApp · (51) 98283-1876",
          href: "https://wa.me/5551982831876",
        },
        {
          icon: "email",
          label: "anajuliavognach93@gmail.com",
          href: "mailto:anajuliavognach93@gmail.com",
        },
        {
          icon: "instagram",
          label: "@psicoanavognach",
          href: "https://instagram.com/psicoanavognach",
          external: true,
        },
      ],
    },
    {
      title: "Navegação",
      links: [
        { label: "Trajetória", href: "#sobre" },
        { label: "Abordagem", href: "#abordagem" },
        { label: "Serviços", href: "#servicos" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Atendimento",
      links: [
        { label: "100% online", href: null },
        { label: "Adultos · Brasil", href: null },
        { label: "Segunda a sexta", href: null },
        { label: "Resposta em até 24h", href: null },
      ],
    },
  ],
  legal: {
    copyright: "© {YEAR} Ana Julia Vognach · Todos os direitos reservados",
    registry: "Psicóloga Clínica · CRP/SC 12/30269",
  },
  layout: {
    desktopColumns: 4, // brand | contato | navegação | atendimento
    mobileColumns: 2, // brand (full) | contato (full) | navegação + atendimento lado a lado
    textAlign: "left",
    background: "ink",
    notes: [
      "Fundo preto (ink), texto off-white com 80% de opacidade",
      "Brand block centralizado (selo Ψ + nome)",
      "No mobile, brand e contato ocupam linha inteira; nav e atendimento dividem em 2 cols",
      "Ícones outline (WhatsApp, e-mail, Instagram) ao lado de cada link de contato",
      "Linha legal embaixo, em coluna no mobile, com font 11.5–12.5px",
    ],
  } as Layout & { notes: string[] },
};

// ────────────────────────────────────────────────────────────────
// FLOATING · WhatsApp button
// ────────────────────────────────────────────────────────────────

export const floatingWhatsapp = {
  /** Apenas ícone — texto foi REMOVIDO a pedido */
  href: "https://wa.me/5551982831876?text=Ol%C3%A1%2C%20Ana%20Julia.%20Vi%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20conversa%20inicial.",
  ariaLabel: "Agendar conversa pelo WhatsApp",
  whatsappMessage: "Olá, Ana Julia. Vi seu site e gostaria de agendar uma conversa inicial.",
  layout: {
    desktopColumns: 1,
    mobileColumns: 1,
    notes: [
      "Botão circular fixo, bottom-right (22px do canto)",
      "Fundo oliva-light (#7B8F7F), hover escurece para oliva (#4A5D4E)",
      "Diâmetro 58px, ícone WhatsApp branco 28px",
      "Sombra suave (0 14px 40px rgba(74,93,78,.22))",
    ],
  } as Layout & { notes: string[] },
};

// ────────────────────────────────────────────────────────────────
// WHATSAPP MESSAGES · referência centralizada
// ────────────────────────────────────────────────────────────────

export const whatsappMessages = {
  schedule: "Olá, Ana Julia. Vi seu site e gostaria de agendar uma conversa inicial.",
  questions:
    "Olá, Ana Julia. Vi seu site e gostaria de tirar uma dúvida sobre como funciona o seu acompanhamento antes de agendar.",
};

// ────────────────────────────────────────────────────────────────
// ANALYTICS · eventos mínimos
// ────────────────────────────────────────────────────────────────

export const analyticsEvents = [
  "whatsapp_click", // qualquer CTA WhatsApp clicado
  "faq_expand", // FAQ item aberto
  "services_expand", // serviço aberto
  "scroll_75", // 75% da página atingido
] as const;

// ────────────────────────────────────────────────────────────────
// CONTEÚDO COMPLETO · export agregado
// ────────────────────────────────────────────────────────────────

export const siteContent = {
  meta,
  brand,
  nav,
  hero,
  support,
  about,
  approach,
  services,
  reviews,
  mission,
  faq,
  footer,
  floatingWhatsapp,
  whatsappMessages,
  analyticsEvents,
};

export default siteContent;
