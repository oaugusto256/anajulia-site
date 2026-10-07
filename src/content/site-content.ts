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
  title: "Psicóloga Online e Presencial em Florianópolis | Ana Julia Vognach",
  description:
    "Psicoterapia online para o Brasil e exterior, e presencial em Florianópolis. Apoio especializado em transições de vida, saúde mental, luto e maternidade.",
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

/** Data da última alteração de conteúdo (ISO). Atualizar manualmente — usada no sitemap. */
export const contentUpdatedAt = "2026-10-07";

// ────────────────────────────────────────────────────────────────
// BRAND · identidade
// ────────────────────────────────────────────────────────────────

export const brand = {
  kicker: "Psicóloga", // pequeno, italic, oliva
  name: "Ana Julia Vognach", // serif Playfair
  sub: "CRP 12/30269", // small caps no header
  fullTitle: "Ana Julia Vognach · Psicóloga Clínica",
  crp: "CRP/SC 12/30269",
  jobTitle: "Psicóloga Clínica",
  credentials: {
    license: {
      name: "CRP/SC 12/30269",
      issuer: "Conselho Regional de Psicologia – 12ª Região",
    },
    residency: {
      name: "Residência Multiprofissional em Saúde – Oncologia",
    },
  },
  knowsAboutExtra: ["Psicologia sistêmica"],
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
  location: {
    streetAddress: "Rodovia SC-405, 4397",
    complement: "Shopping Oka Floripa, Torre Sol, Sala 114",
    neighborhood: "Campeche",
    city: "Florianópolis",
    region: "SC",
    postalCode: "88065-000",
    country: "BR",
    /** Preencher a partir do Google Business Profile; omitido do schema enquanto undefined. */
    geo: undefined as { lat: number; lng: number } | undefined,
    hours: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "20:00",
      },
    ],
    hoursLabel: "Segunda a sexta, 8h às 20h",
    gbpUrl: "https://maps.app.goo.gl/yx6VRRiSPBZc5SBH7?g_st=iw",
    areaServed: {
      city: "Florianópolis",
      places: ["Sul da Ilha", "Campeche"],
      country: "Brasil",
    },
  },
};

// ────────────────────────────────────────────────────────────────
// NAV · header + drawer mobile
// ────────────────────────────────────────────────────────────────

export const nav = {
  links: [
    { label: "Como eu trabalho", href: "/#abordagem" },
    { label: "Como posso ajudar", href: "/#servicos" },
    { label: "Trajetória", href: "/#sobre" },
    { label: "Dúvidas", href: "/#faq" },
    { label: "Contato", href: "/#contato" },
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
  eyebrow: "Psicologia Clínica | Online e Presencial",
  title: {
    plain: "Psicoterapia para momentos em que a vida muda mais rápido do que conseguimos acompanhar.",
    italic: "",
  },
  /** Texto plano para SEO/SSR: */
  titlePlain: "Psicoterapia para momentos em que a vida muda mais rápido do que conseguimos acompanhar.",
  subtitle: [
    "Acolher o que está sendo vivido, compreender seus impactos e construir caminhos mais coerentes com quem você é.",
  ],
  cta: {
    label: "Agendar conversa inicial",
    href: "https://wa.me/5551982831876?text=Ol%C3%A1%2C%20Ana%20Julia.%20Vi%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20conversa%20inicial.",
    variant: "primary",
    whatsappMessage: "Olá, Ana Julia. Vi seu site e gostaria de agendar uma conversa inicial.",
  } satisfies CTA,
  photo: {
    src: "fotos/IMG_8209.jpg",
    alt: "Ana Julia Vognach - Psicóloga Clínica (CRP 12/30269)",
    objectPosition: "center 30%",
  },
  stamp: {
    /** Selo circular sobreposto à foto (canto inferior-esquerdo) */
    small: "Desde 2018",
    line1: "Cuidado em",
    line2: "saúde mental",
  },
  metrics: [
    { value: "CRP 12/30269", label: "Psicóloga Clínica" },
    { value: "8+", label: "anos de experiência clínica" },
    { value: "Residência Hospitalar", label: "Especialização em Oncologia" },
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
      "Aspas curvas decorativas renderizadas grandes acima do texto, em oliva",
      "Lista usa bullets pontuais (6px, oliva) — sem numeração",
      "Cada item tem um <strong> seguido de texto regular",
    ],
  } as Layout & { notes: string[] },
};

// ────────────────────────────────────────────────────────────────
// 3 · ABOUT (Quem é Ana Julia + trajetória colapsada)
// ────────────────────────────────────────────────────────────────

export const about = {
  eyebrow: "Quem é a sua Psicóloga",
  title: "Olá, sou Ana Julia",
  lead: "Sou psicóloga clínica, especialista em Oncologia por meio de Residência Multiprofissional em Saúde.",
  body: "Minha trajetória profissional foi construída em diferentes contextos de cuidado, incluindo hospitais, cuidados paliativos, saúde mental, saúde da família e programas de promoção da saúde em empresas.",
  expandToggle: {
    closedLabel: "Conheça mais sobre a minha trajetória",
    openLabel: "Recolher trajetória",
  },
  trajectory: {
    sections: [
      {
        title: "",
        body: [
          "Ao longo desses anos, acompanhei pessoas e famílias em momentos marcados por intenso sofrimento, adoecimento, perdas, mudanças, conflitos e processos de reconstrução da própria vida.",
          "Essas experiências fortaleceram uma compreensão que orienta minha prática clínica até hoje: o sofrimento humano nem sempre pode ser evitado, mas deve ser acolhido, compreendido e transformado quando encontra espaço para ser vivido e elaborado.",
          "Atualmente realizo atendimentos psicológicos para adolescentes, adultos e idosos, de forma online e presencial em Florianópolis oferecendo um espaço ético, acolhedor e comprometido com a singularidade e as necessidades de cada pessoa.",
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
  title: "Um espaço de escuta, presença e acolhimento",
  body: [
    "Na psicoterapia, você encontra um espaço seguro e sigiloso para expressar o que está vivendo. Com escuta, empatia e respeito, acompanho você na compreensão do que sente e de como se relaciona com o mundo, desenvolvendo recursos para construir caminhos mais leves e autênticos diante dos desafios da vida.",
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
  eyebrow: "Como posso ajudar",
  tagline: "Atendimentos presenciais em Florianópolis e online para todo o Brasil e exterior.",
  channels: ["Atendimento online", "Atendimento presencial em Florianópolis"],
  items: [
    {
      title: "Psicoterapia Individual",
      body: [
        "Atendimento psicológico individual para adolescentes, adultos e idosos, construído a partir da história, das necessidades e dos objetivos de cada pessoa, favorecendo mudanças e novas possibilidades.",
      ],
    },
    {
      title: "Psicoterapia de Casal",
      body: [
        "Acompanhamento para casais que desejam compreender melhor os conflitos da relação, fortalecer o diálogo e construir formas mais saudáveis de convivência.",
      ],
    },
    {
      title: "Psicoterapia Familiar",
      body: [
        "Acompanhamento voltado à compreensão das relações familiares, conflitos e mudanças que impactam a dinâmica da família.",
      ],
    },
    {
      title: "Psicoterapia de Grupo",
      body: [
        "Encontros terapêuticos realizados a partir de temas e demandas específicas, favorecendo a troca de experiências, o sentimento de pertencimento e a construção coletiva de novas possibilidades.",
        "Novos grupos serão divulgados conforme a formação de turmas.",
      ],
    },
  ],
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
  eyebrow: "No que acredito",
  paragraphs: [
    "Acredito no potencial de mudança e transformação que existe em cada pessoa.",
    "Mesmo diante das dificuldades, é possível ampliar a compreensão sobre si mesma(o) e encontrar novas possibilidades de viver com mais consciência, autenticidade e sentido de vida.",
  ],
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
      "Aspas curvas integradas no próprio texto",
      "Mission-card lateral (foco/modalidade/formação/registro) foi REMOVIDA",
      "Sem CTA — fechamento emocional",
      "Cormorant Garamond italic 300, line-height 1.35, font-size 1.4–2rem",
    ],
  } as Layout & { notes: string[] },
};

// ────────────────────────────────────────────────────────────────
// 8 · AREAS (Áreas de Atuação)
// ────────────────────────────────────────────────────────────────

export const areas = {
  eyebrow: "Áreas de Atuação",
  /** Link do card para a página do tema (só aparece quando a página está publicada). */
  linkLabel: "Saiba mais",
  items: [
    {
      id: "clinica-do-trabalho",
      icon: "briefcase",
      title: "Saúde Mental e Trabalho",
      body: "Dificuldades emocionais relacionadas ao trabalho, autocobrança, insegurança, conflitos interpessoais, mudanças de carreira, sobrecarga, esgotamento emocional e burnout.",
    },
    {
      id: "psicoterapia-maes",
      icon: "person-with-child",
      title: "Maternidade, Parentalidade e Família",
      body: "Gestação, puerpério, adaptação à maternidade e à paternidade, orientação parental, terapia de casal e familiar, conflitos familiares e desafios que acompanham a construção da vida em família.",
    },
    {
      id: "luto-transicoes",
      icon: "horizon",
      title: "Luto e Perdas",
      body: "Processos de luto, luto antecipatório e diferentes experiências de perda e mudança que podem impactar profundamente a vida e exigir novas formas de lidar com o que foi vivido.",
    },
    {
      id: "psico-oncologia",
      icon: "horizon",
      title: "Psico-Oncologia e Cuidados Paliativos",
      body: [
        "Acompanhamento psicológico para pessoas em tratamento oncológico (câncer), que convivem com doenças graves ou ameaçadoras da vida, e seus familiares.",
        "Um espaço de acolhimento para lidar com os impactos emocionais do adoecimento, as mudanças decorrentes do tratamento, as incertezas e os desafios relacionados aos cuidados paliativos.",
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────────────
// 9 · FAQ
// ────────────────────────────────────────────────────────────────

export const faq = {
  eyebrow: "Dúvidas Frequentes",
  items: [
    {
      id: "o-que-e",
      question: "O que é psicoterapia e será que eu preciso?",
      answer:
        "A psicoterapia é um espaço de acolhimento que serve para todas as pessoas; não precisa existir um problema para iniciar. É um espaço para conhecer mais sobre si, se entender e aprender a se autorregular para viver com mais consciência, presença e leveza.",
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
        "O foco é o acolhimento. Não há roteiro rígido ou pressão para \"saber por onde começar\". É um espaço para nos conhecermos e entendermos como posso te acompanhar nessa jornada.",
    },
    {
      id: "atendimento-empresas",
      question: "Você também realiza atendimentos para empresas e instituições?",
      answer: [
        "Sim. Além da atuação clínica, também desenvolvo palestras, workshops e ações voltadas à promoção da saúde mental em empresas e instituições.",
        "Os temas podem ser adaptados às necessidades de cada organização, com foco em prevenção do adoecimento psíquico, qualidade de vida, saúde emocional e fortalecimento das relações de trabalho.",
      ],
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
        { label: "Trajetória", href: "/#sobre" },
        { label: "Abordagem", href: "/#abordagem" },
        { label: "Serviços", href: "/#servicos" },
        { label: "FAQ", href: "/#faq" },
      ],
    },
    {
      title: "Atendimento",
      links: [
        { label: "Online e presencial", href: null },
        { label: "Adultos · Brasil", href: null },
        { label: "Segunda a sexta", href: null },
        { label: "Resposta em até 24h", href: null },
      ],
    },
  ],
  address: {
    postalCodePrefix: "CEP",
  },
  legal: {
    copyright: "© {YEAR} Ana Julia Vognach · Todos os direitos reservados",
    registry: "Psicóloga Clínica · CRP/SC 12/30269 · CNPJ 67.100.449/0001-00",
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
// TOPIC PAGES · uma página por área de atuação
// ────────────────────────────────────────────────────────────────

export type TopicPage = {
  slug: string;
  /** Corresponde a areas.items[].id */
  areaId: string;
  /** "draft": acessível pela URL, mas noindex, fora do sitemap/llms.txt e sem links internos. */
  status: "draft" | "published";
  seo: { title: string; description: string };
  breadcrumbLabel: string;
  hero: { eyebrow: string; title: string; intro: string };
  sections: { heading: string; paragraphs: string[] }[];
  faq: { id: string; question: string; answer: string }[];
  cta: { label: string; whatsappMessage: string };
  /** Data ISO (AAAA-MM-DD) da última revisão por Ana Julia. */
  reviewedAt: string;
  /** Slugs de outras páginas de tema. */
  related: string[];
};

export const topicPages: TopicPage[] = [
  {
    slug: "burnout-saude-mental-trabalho",
    areaId: "clinica-do-trabalho",
    status: "draft",
    seo: {
      title: "Burnout e Saúde Mental no Trabalho",
      description:
        "Psicoterapia para burnout, esgotamento e sofrimento ligado ao trabalho. Atendimento online para todo o Brasil e presencial em Florianópolis (Campeche).",
    },
    breadcrumbLabel: "Saúde mental e trabalho",
    hero: {
      eyebrow: "Áreas de atuação",
      title: "Burnout e saúde mental no trabalho",
      intro:
        "Quando o trabalho ocupa quase todo o espaço da vida, o cansaço deixa de ser passageiro. A psicoterapia oferece um lugar seguro para compreender esse esgotamento e cuidar de você, no tempo que o seu processo pede.",
    },
    sections: [
      {
        heading: "Como saber se estou com burnout?",
        paragraphs: [
          "Não existe um teste que responda a essa pergunta sozinho. Alguns sinais, quando aparecem juntos e se prolongam, podem indicar um esgotamento ligado ao trabalho e merecem atenção.",
          "Entre eles estão um cansaço que não passa com o descanso, a sensação de distância ou descrença em relação ao trabalho, irritabilidade, dificuldade de concentração e a impressão de que nada do que você faz é suficiente. Também podem surgir alterações no sono, no apetite e no corpo, como dores e tensão constantes.",
          "Esses sinais, por si só, não fecham um diagnóstico. A compreensão do que está acontecendo é construída com cuidado, em sessão, considerando a sua história, o seu contexto de trabalho e, quando necessário, a avaliação de outros profissionais de saúde.",
        ],
      },
      {
        heading: "Burnout é a mesma coisa que estresse?",
        paragraphs: [
          "Não exatamente. O estresse é uma resposta do corpo e da mente às demandas do dia a dia e pode ser passageiro; o burnout está associado a um desgaste prolongado, ligado especificamente ao trabalho.",
          "Em períodos de mais pressão, é comum sentir tensão, pressa e preocupação, que tendem a diminuir quando a demanda passa. No esgotamento, a experiência costuma ser outra: mesmo nos momentos de pausa a energia não volta, e o trabalho passa a ser vivido com distanciamento ou peso.",
          "Os dois podem se misturar, e nem sempre é simples perceber onde termina um e começa o outro. Por isso, mais do que encontrar um nome rapidamente, vale olhar com atenção para o que você está sentindo e há quanto tempo isso acontece. Em alguns casos, o cansaço também pode estar ligado a outras questões de saúde, o que reforça a importância de uma avaliação cuidadosa.",
        ],
      },
      {
        heading: "Quando o trabalho invade a vida pessoal",
        paragraphs: [
          "Às vezes o trabalho não termina quando o expediente acaba. As preocupações seguem para casa, ocupam o descanso e passam a afetar as relações, a parentalidade e o cuidado consigo.",
          "Mensagens fora de hora, metas difíceis de alcançar, autocobrança, insegurança e conflitos com colegas ou lideranças podem ir ocupando cada vez mais espaço. Com o tempo, fica difícil lembrar quem você é para além da função que exerce. Também pode ficar mais difícil desligar, estar presente com quem você ama e encontrar prazer em atividades que antes faziam sentido.",
          "Mudanças de carreira, desligamentos, promoções e o retorno ao trabalho depois de uma licença também mexem com a identidade e com a rotina. São momentos que pedem espaço para serem pensados com calma, sem a pressão de encontrar respostas prontas.",
        ],
      },
      {
        heading: "Como a psicoterapia pode ajudar",
        paragraphs: [
          "A psicoterapia oferece um espaço seguro e sigiloso para compreender como o trabalho tem afetado você e para pensar, com mais clareza, nas escolhas possíveis diante disso.",
          "Ao longo do acompanhamento, olhamos para os seus limites, para a forma como você se relaciona com as exigências e para padrões de autocobrança que às vezes passam despercebidos. A partir disso, você pode desenvolver recursos para se posicionar de outro modo, reconhecer sinais de sobrecarga e cuidar da sua saúde mental no dia a dia.",
          "Minha trajetória inclui programas de promoção da saúde em empresas, além de outros contextos de cuidado, o que me ajuda a compreender as dinâmicas do trabalho sem perder de vista a sua história pessoal. Cada processo respeita o seu tempo e, quando fizer sentido, pode caminhar junto com o acompanhamento de outros profissionais de saúde.",
        ],
      },
      {
        heading: "Como funciona o atendimento",
        paragraphs: [
          "O primeiro passo é uma breve conversa inicial, sem compromisso, para você me conhecer, tirar dúvidas e sentir se o meu modo de trabalho faz sentido para o que você busca. Para agendar, basta me enviar uma mensagem pelo WhatsApp.",
          "Os atendimentos acontecem online, para todo o Brasil e exterior, por chamada de vídeo através de um link seguro enviado previamente. Também atendo presencialmente em Florianópolis, no Shopping Oka Floripa, no Campeche (Sul da Ilha).",
          "O pagamento é feito via PIX ou transferência bancária, e entrego recibos para que você possa solicitar reembolso no seu plano de saúde, caso ele ofereça essa modalidade. Sou psicóloga clínica, com registro CRP/SC 12/30269.",
        ],
      },
    ],
    faq: [
      {
        id: "burnout-diagnostico",
        question: "Preciso ter um diagnóstico para começar?",
        answer:
          "Não. Você pode começar a psicoterapia a partir do que está sentindo, mesmo sem saber dar um nome a isso. Se já existir um diagnóstico ou um acompanhamento médico, ele é bem-vindo e pode fazer parte da conversa; se não existir, a compreensão do que está acontecendo vai sendo construída em sessão.",
      },
      {
        id: "burnout-online",
        question: "O atendimento online é indicado para quem está esgotada(o)?",
        answer:
          "Pode ser, sim. Fazer a sessão de onde você estiver evita deslocamentos e pode facilitar a constância em um período de pouca energia; o importante é estar em um ambiente silencioso, privativo e seguro. Se você preferir o encontro presencial, ele também é possível em Florianópolis, no Campeche.",
      },
      {
        id: "burnout-duracao",
        question: "Quanto tempo dura o acompanhamento?",
        answer:
          "Não há um tempo definido de antemão. A duração depende da sua história, do momento que você está vivendo e dos objetivos que vamos construindo ao longo do processo. A frequência e o andamento das sessões são combinados com você e revisitados sempre que necessário.",
      },
    ],
    cta: {
      label: "Agendar conversa inicial",
      whatsappMessage:
        "Olá, Ana Julia. Vi sua página sobre saúde mental e trabalho e gostaria de agendar uma conversa inicial.",
    },
    reviewedAt: "2026-10-07",
    related: ["luto-e-perdas", "maternidade-parentalidade"],
  },
  {
    slug: "maternidade-parentalidade",
    areaId: "psicoterapia-maes",
    status: "draft",
    seo: {
      title: "Psicóloga para Maternidade e Família",
      description:
        "Psicoterapia na gestação, no puerpério e na parentalidade: apoio a mães, pais e famílias. Online para todo o Brasil e presencial em Florianópolis.",
    },
    breadcrumbLabel: "Maternidade e parentalidade",
    hero: {
      eyebrow: "Áreas de atuação",
      title: "Maternidade, parentalidade e família",
      intro:
        "A chegada de um filho transforma a rotina, as relações e a forma como você se percebe. A psicoterapia pode ser um espaço para acolher essa travessia, com tudo o que ela traz de bonito e de difícil.",
    },
    sections: [
      {
        heading: "O que é normal sentir no puerpério?",
        paragraphs: [
          "No puerpério, é comum sentir emoções intensas e, muitas vezes, contraditórias: amor e cansaço, alegria e tristeza, encantamento e medo. Viver essa mistura não significa que algo esteja errado com você ou com o seu vínculo com o bebê.",
          "Nas primeiras semanas, muitas mulheres vivem oscilações de humor, choro fácil, insegurança e a sensação de estar sobrecarregadas. A privação de sono, as mudanças no corpo e a nova rotina pesam, e a sensação de não reconhecer a própria vida pode assustar.",
          "Quando a tristeza, a ansiedade ou a falta de interesse se prolongam, se intensificam ou dificultam o cuidado consigo e com o bebê, isso pode indicar quadros como a depressão ou a ansiedade pós-parto, que merecem atenção. Essa avaliação é feita com cuidado, em sessão, e pode envolver outros profissionais de saúde que acompanham você.",
        ],
      },
      {
        heading: "Como conciliar maternidade, carreira e identidade?",
        paragraphs: [
          "Não existe uma fórmula única. Conciliar esses papéis costuma envolver escolhas, renúncias e ajustes que precisam fazer sentido para a sua história, e não apenas para as expectativas de fora.",
          "É comum sentir ambivalência: desejar estar com o filho e, ao mesmo tempo, sentir falta do trabalho, ou o contrário. O retorno depois da licença, as cobranças por produtividade e a culpa por não dar conta de tudo podem tornar esse período especialmente exigente.",
          "Na psicoterapia, há espaço para olhar para essas tensões sem julgamento e para pensar em quem você está se tornando. A maternidade transforma a identidade, e reconhecer essa mudança pode ajudar você a fazer escolhas mais coerentes com o que considera essencial.",
        ],
      },
      {
        heading: "Psicoterapia na gestação e no pós-parto",
        paragraphs: [
          "A psicoterapia pode acompanhar você desde a gestação até os primeiros anos com o bebê, oferecendo um espaço de escuta para o que muda no corpo, nas relações e na forma de se perceber.",
          "Na gestação, podem surgir expectativas, medos, lembranças da própria história familiar e dúvidas sobre o parto e a chegada do bebê. No pós-parto, o foco muitas vezes se volta para a adaptação à nova rotina, para o cansaço e para o lugar que você passa a ocupar nessa nova configuração.",
          "Também há espaço para a adaptação à paternidade e para as mudanças que a chegada do bebê traz para o casal e para a família. Cada processo respeita o seu tempo e aquilo que você deseja trabalhar.",
        ],
      },
      {
        heading: "Orientação parental e terapia familiar",
        paragraphs: [
          "A orientação parental é um espaço para mães, pais e cuidadores refletirem sobre os desafios da criação dos filhos. Já a terapia familiar e a de casal olham para as relações e para as mudanças que afetam a dinâmica da família.",
          "A chegada de um filho, as diferenças na forma de educar, a divisão das tarefas e os conflitos do dia a dia podem gerar distanciamento e desgaste no casal e na família. Nesses momentos, conversar com a mediação de uma profissional pode ajudar a ampliar o diálogo e a compreender o que está acontecendo.",
          "Minha atuação parte de uma visão sistêmica: o que acontece com uma pessoa reverbera nas relações à sua volta, e o contrário também. Por isso, o formato do acompanhamento, seja individual, de casal ou familiar, é pensado junto com você, a partir do que faz mais sentido para o momento.",
        ],
      },
      {
        heading: "Como funciona o atendimento",
        paragraphs: [
          "Tudo começa com uma breve conversa inicial, sem compromisso, para você me conhecer, tirar dúvidas e sentir se o meu modo de trabalho combina com o que você busca. Para agendar, é só me enviar uma mensagem pelo WhatsApp.",
          "As sessões podem ser online, para todo o Brasil e exterior, por chamada de vídeo através de um link seguro enviado previamente, o que costuma facilitar a rotina com um bebê em casa. Também atendo presencialmente em Florianópolis, no Shopping Oka Floripa, no Campeche (Sul da Ilha).",
          "O pagamento é feito via PIX ou transferência bancária, com recibos para que você possa solicitar reembolso no seu plano de saúde, caso ele ofereça essa modalidade. Sou psicóloga clínica, com registro CRP/SC 12/30269.",
        ],
      },
    ],
    faq: [
      {
        id: "maternidade-bebe",
        question: "Posso fazer a sessão online com o bebê por perto?",
        answer:
          "Isso pode ser conversado e combinado entre nós, a partir da sua rotina. Nem sempre é possível ter alguém para cuidar do bebê durante a sessão, e a presença do bebê faz parte da realidade de muitas mães nesse período. O importante é estar em um ambiente o mais tranquilo e privativo possível, para que você possa falar com liberdade.",
      },
      {
        id: "maternidade-pais",
        question: "Você atende pais e casais também?",
        answer:
          "Sim. Atendo mães e pais em psicoterapia individual e também ofereço psicoterapia de casal, psicoterapia familiar e orientação parental. Os desafios da parentalidade atravessam todas as pessoas envolvidas no cuidado, e cada uma delas pode precisar de um espaço próprio de escuta.",
      },
      {
        id: "maternidade-quando",
        question: "Quando procurar ajuda no pós-parto?",
        answer:
          "Não é preciso esperar que algo fique grave para buscar apoio. Se a tristeza, a ansiedade ou o cansaço estão pesados demais, ou se você tem dificuldade de se reconhecer e de cuidar de si, vale conversar com uma profissional. Em situações de urgência, ou se surgirem pensamentos de se machucar, busque imediatamente um serviço de saúde.",
      },
    ],
    cta: {
      label: "Agendar conversa inicial",
      whatsappMessage:
        "Olá, Ana Julia. Vi sua página sobre maternidade e parentalidade e gostaria de agendar uma conversa inicial.",
    },
    reviewedAt: "2026-10-07",
    related: ["burnout-saude-mental-trabalho", "luto-e-perdas"],
  },
  {
    slug: "luto-e-perdas",
    areaId: "luto-transicoes",
    status: "draft",
    seo: {
      title: "Psicoterapia para Luto e Perdas",
      description:
        "Acompanhamento psicológico no luto, no luto antecipatório e em outras perdas. Psicoterapia online para todo o Brasil e presencial em Florianópolis.",
    },
    breadcrumbLabel: "Luto e perdas",
    hero: {
      eyebrow: "Áreas de atuação",
      title: "Luto e perdas",
      intro:
        "Perder alguém ou algo importante muda a forma como a vida segue. A psicoterapia oferece um espaço para que essa dor seja acolhida, compreendida e vivida no seu tempo.",
    },
    sections: [
      {
        heading: "O que é o luto?",
        paragraphs: [
          "O luto é uma resposta natural a uma perda significativa. Ele envolve emoções, pensamentos, sensações no corpo e mudanças na forma de se relacionar com o mundo.",
          "Tristeza, saudade, raiva, culpa, alívio e confusão podem aparecer, às vezes ao mesmo tempo. Também é comum sentir cansaço, dificuldade para dormir ou se concentrar e a impressão de que os outros seguem a vida enquanto a sua parou.",
          "Não existe um jeito certo de viver o luto. Cada pessoa atravessa a perda a partir da sua história, da relação com quem ou com o que foi perdido e das circunstâncias em que tudo aconteceu. Algumas pessoas precisam falar muito sobre o que aconteceu; outras precisam de silêncio e de tempo antes de conseguir colocar a dor em palavras.",
        ],
      },
      {
        heading: "Existe um tempo certo para o luto?",
        paragraphs: [
          "Não. O luto não segue um calendário, e cada pessoa precisa do seu próprio tempo para atravessar a perda.",
          "É comum que a dor mude de forma ao longo dos meses: há dias mais leves e outros em que tudo parece voltar com força, como em datas especiais e aniversários. Isso não significa que você esteja andando para trás; faz parte de um processo que não acontece em linha reta.",
          "Quando o sofrimento permanece muito intenso por um longo período e dificulta seguir com a rotina, o trabalho ou as relações, pode ser importante buscar apoio. Essa compreensão é construída com cuidado, em sessão, sem a exigência de deixar para trás o que você viveu.",
        ],
      },
      {
        heading: "O que é luto antecipatório?",
        paragraphs: [
          "O luto antecipatório é o luto que começa antes de a perda acontecer, por exemplo, diante de um diagnóstico grave ou do adoecimento progressivo de alguém que você ama.",
          "Nesse período, convivem a esperança, o medo, o cansaço de cuidar e, por vezes, a culpa por já sentir a falta de quem ainda está presente. Esses sentimentos podem ser confusos e difíceis de compartilhar com outras pessoas da família. Também é comum sentir que não há permissão para viver essa dor, já que a pessoa querida ainda está aqui.",
          "Ter um espaço para falar sobre isso pode ajudar a viver esse tempo com mais presença, a cuidar também de si e a pensar nas despedidas possíveis. Minha formação em Oncologia, por meio de Residência Multiprofissional em Saúde, e a experiência em cuidados paliativos me colocaram em contato próximo com essas vivências.",
        ],
      },
      {
        heading: "Como a psicoterapia acompanha o luto",
        paragraphs: [
          "A psicoterapia oferece um espaço seguro e sigiloso para falar da perda, das lembranças e de tudo o que ficou em aberto, sem a pressão de precisar estar bem.",
          "Ao longo do acompanhamento, há espaço para acolher a dor, compreender os sentimentos que surgem e, aos poucos, encontrar formas de seguir vivendo com a ausência. Não se trata de esquecer, mas de construir uma nova forma de se relacionar com quem ou com o que foi perdido. Em alguns momentos, o trabalho envolve também olhar para as mudanças práticas que a perda trouxe para a rotina, para a família e para os planos.",
          "Ao longo da minha trajetória, acompanhei pessoas e famílias em momentos de adoecimento, perdas e reconstrução da própria vida, em hospitais e em cuidados paliativos. Cada processo respeita o seu ritmo, e o que será trabalhado é construído junto com você.",
        ],
      },
      {
        heading: "Como funciona o atendimento",
        paragraphs: [
          "O primeiro contato é uma breve conversa inicial, sem compromisso, para você me conhecer, tirar dúvidas e sentir se o meu modo de trabalho faz sentido para este momento. Para agendar, basta me enviar uma mensagem pelo WhatsApp.",
          "Os atendimentos acontecem online, para todo o Brasil e exterior, por chamada de vídeo através de um link seguro enviado previamente. Também atendo presencialmente em Florianópolis, no Shopping Oka Floripa, no Campeche (Sul da Ilha).",
          "O pagamento é feito via PIX ou transferência bancária, e entrego recibos para que você possa solicitar reembolso no seu plano de saúde, caso ele ofereça essa modalidade. Sou psicóloga clínica, com registro CRP/SC 12/30269.",
        ],
      },
    ],
    faq: [
      {
        id: "luto-quando",
        question: "Quando procurar psicoterapia depois de uma perda?",
        answer:
          "Não existe um momento certo. Algumas pessoas buscam a psicoterapia logo após a perda, outras meses ou anos depois, quando percebem que a dor continua muito presente. Se você sente que está difícil carregar isso sozinha(o), esse já é um bom motivo para conversar.",
      },
      {
        id: "luto-morte",
        question: "O luto só acontece quando alguém morre?",
        answer:
          "Não. O luto pode acompanhar diferentes perdas: o fim de um relacionamento, uma mudança de cidade ou de país, a perda de um emprego, um diagnóstico, uma perda gestacional ou a mudança de um projeto de vida. Muitas vezes essas perdas são pouco reconhecidas pelas outras pessoas, o que pode tornar a experiência ainda mais solitária. Toda perda significativa pede espaço para ser reconhecida e elaborada.",
      },
      {
        id: "luto-online",
        question: "Posso fazer psicoterapia para o luto online?",
        answer:
          "Sim. A psicoterapia online acontece por chamada de vídeo, através de um link seguro, e permite que você seja acompanhada(o) de onde estiver, no Brasil ou no exterior. O importante é estar em um ambiente silencioso, privativo e seguro, onde você se sinta à vontade para falar sobre a perda.",
      },
    ],
    cta: {
      label: "Agendar conversa inicial",
      whatsappMessage:
        "Olá, Ana Julia. Vi sua página sobre luto e perdas e gostaria de agendar uma conversa inicial.",
    },
    reviewedAt: "2026-10-07",
    related: ["psico-oncologia-cuidados-paliativos", "maternidade-parentalidade"],
  },
  {
    slug: "psico-oncologia-cuidados-paliativos",
    areaId: "psico-oncologia",
    status: "draft",
    seo: {
      title: "Psico-Oncologia e Cuidados Paliativos",
      description:
        "Apoio psicológico para pessoas em tratamento oncológico, com doenças graves, e seus familiares. Online para todo o Brasil e presencial em Florianópolis.",
    },
    breadcrumbLabel: "Psico-oncologia",
    hero: {
      eyebrow: "Áreas de atuação",
      title: "Psico-oncologia e cuidados paliativos",
      intro:
        "Um diagnóstico de câncer ou de uma doença grave transforma a vida de quem adoece e de quem cuida. A psicoterapia oferece um espaço de acolhimento para atravessar esse momento com escuta e presença.",
    },
    sections: [
      {
        heading: "O que é psico-oncologia?",
        paragraphs: [
          "A psico-oncologia é a área da psicologia que se dedica aos aspectos emocionais do câncer, do diagnóstico ao tratamento, à vida depois dele ou ao fim da vida. Ela acolhe a pessoa que adoece, seus familiares e cuidadores.",
          "O adoecimento costuma trazer medo, incerteza e mudanças no corpo, na rotina, no trabalho e nas relações. Também podem surgir dúvidas sobre o futuro, sobre a própria imagem e sobre como contar o que está acontecendo para as pessoas próximas. Olhar para esses impactos faz parte de um cuidado integral com a saúde.",
          "Sou psicóloga clínica (CRP/SC 12/30269) e especialista em Oncologia por meio de Residência Multiprofissional em Saúde, com experiência em hospitais e em cuidados paliativos. A psicoterapia não substitui o acompanhamento da equipe de saúde: ela caminha ao lado dele.",
        ],
      },
      {
        heading: "Como lidar com o diagnóstico de câncer?",
        paragraphs: [
          "Não há uma forma certa de reagir a um diagnóstico de câncer. Choque, medo, raiva, tristeza e até uma aparente calma são respostas possíveis, e cada pessoa precisa de tempo para compreender o que está acontecendo.",
          "Nos primeiros momentos, é comum sentir que a vida perdeu o chão. Muitas informações chegam ao mesmo tempo, decisões precisam ser tomadas e nem sempre há espaço para falar sobre o que se sente. Algumas pessoas sentem necessidade de falar muito sobre a doença; outras preferem preservar a rotina e conversar sobre outros assuntos, e as duas formas merecem respeito.",
          "Na psicoterapia, você encontra um lugar para nomear esses sentimentos, organizar os pensamentos e pensar em como deseja atravessar o tratamento. O foco está no que é importante para você em cada etapa, respeitando os seus limites e o seu ritmo.",
        ],
      },
      {
        heading: "Apoio psicológico para familiares e cuidadores",
        paragraphs: [
          "Familiares e cuidadores também são afetados pelo adoecimento e podem precisar de um espaço próprio de escuta, para além do lugar de cuidado que ocupam.",
          "Quem cuida muitas vezes deixa as próprias necessidades de lado e convive com o cansaço, o medo da perda e a sensação de que precisa se manter forte o tempo todo. Mudanças nos papéis da família, decisões difíceis e conflitos entre familiares também podem surgir nesse período.",
          "O acompanhamento pode ser individual, para quem cuida, ou envolver a família, quando fizer sentido. É um espaço para cuidar de quem cuida e para fortalecer o diálogo entre as pessoas envolvidas. Também há espaço para acolher o luto, quando ele chega, e o período de reorganização da família depois dele.",
        ],
      },
      {
        heading: "O que são cuidados paliativos?",
        paragraphs: [
          "Cuidados paliativos são uma abordagem voltada à qualidade de vida de pessoas com doenças graves ou que ameaçam a vida, e de suas famílias. Eles não se restringem ao fim da vida e podem acompanhar diferentes momentos do tratamento.",
          "O foco está no alívio do sofrimento físico, emocional, social e espiritual, com atenção ao que é importante para cada pessoa. Esse cuidado é realizado por uma equipe multiprofissional, e a psicologia faz parte dessa rede.",
          "No acompanhamento psicológico, há espaço para falar sobre as incertezas, os desejos, as despedidas e o luto antecipatório, tanto da pessoa que adoece quanto de seus familiares. Minha trajetória em cuidados paliativos me ensinou o valor de acolher esses momentos com delicadeza e respeito.",
        ],
      },
      {
        heading: "Como funciona o atendimento",
        paragraphs: [
          "O primeiro passo é uma breve conversa inicial, sem compromisso, para você me conhecer, tirar dúvidas e sentir se o meu modo de trabalho faz sentido para o que você está vivendo. Para agendar, basta me enviar uma mensagem pelo WhatsApp, seja você a pessoa em tratamento ou alguém da família.",
          "Os atendimentos acontecem online, para todo o Brasil e exterior, por chamada de vídeo através de um link seguro enviado previamente. Também atendo presencialmente em Florianópolis, no Shopping Oka Floripa, no Campeche (Sul da Ilha).",
          "O pagamento é feito via PIX ou transferência bancária, e entrego recibos para que você possa solicitar reembolso no seu plano de saúde, caso ele ofereça essa modalidade. As modalidades de atendimento, por sessão ou em pacotes, são combinadas na nossa primeira conversa.",
        ],
      },
    ],
    faq: [
      {
        id: "onco-tratamento",
        question: "Você atende pacientes durante o tratamento?",
        answer:
          "Sim. Atendo pessoas em diferentes momentos do tratamento oncológico, assim como pessoas que convivem com doenças graves ou ameaçadoras da vida. O acompanhamento respeita a sua disposição em cada fase, e a frequência das sessões pode ser combinada de acordo com a sua rotina de tratamento.",
      },
      {
        id: "onco-familia",
        question: "Familiares também podem fazer acompanhamento?",
        answer:
          "Sim. Familiares e cuidadores podem fazer psicoterapia individual, e também é possível pensar em encontros com a família, quando fizer sentido. Cada pessoa vive o adoecimento de alguém próximo de um jeito, e todas podem precisar de um espaço de escuta. Quando é a família que entra em contato, a conversa inicial também serve para pensarmos juntos no formato mais adequado.",
      },
      {
        id: "onco-online",
        question: "É possível fazer as sessões online durante o tratamento?",
        answer:
          "Sim. As sessões online acontecem por chamada de vídeo, através de um link seguro, e podem ser feitas de casa, evitando deslocamentos em dias de mais cansaço. O importante é estar em um ambiente silencioso, privativo e seguro, onde você se sinta à vontade.",
      },
    ],
    cta: {
      label: "Agendar conversa inicial",
      whatsappMessage:
        "Olá, Ana Julia. Vi sua página sobre psico-oncologia e gostaria de agendar uma conversa inicial.",
    },
    reviewedAt: "2026-10-07",
    related: ["luto-e-perdas", "burnout-saude-mental-trabalho"],
  },
];

export const topicPageUi = {
  breadcrumbHome: "Início",
  breadcrumbAriaLabel: "Você está em",
  reviewedByLabel: "Revisado por",
  relatedHeading: "Outras áreas",
  faqHeading: "Perguntas frequentes",
};

// ────────────────────────────────────────────────────────────────
// LLMS.TXT · resumo para assistentes de IA
// ────────────────────────────────────────────────────────────────

export const llmsTxt = {
  summary:
    "Ana Julia Vognach é psicóloga clínica (CRP/SC 12/30269), especialista em Oncologia por Residência Multiprofissional em Saúde. Atende adolescentes, adultos e idosos online, para todo o Brasil e exterior, e presencialmente em Florianópolis, no Campeche (Sul da Ilha).",
  areasHeading: "Áreas de atuação",
  servicesHeading: "Serviços",
  faqHeading: "Perguntas frequentes",
  contactHeading: "Agendamento",
  whatsappLabel: "WhatsApp",
  emailLabel: "E-mail",
  siteLabel: "Site",
};

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
