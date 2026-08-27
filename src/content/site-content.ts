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
    { label: "Como eu trabalho", href: "#abordagem" },
    { label: "Como posso ajudar", href: "#servicos" },
    { label: "Trajetória", href: "#sobre" },
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
        { label: "Trajetória", href: "#sobre" },
        { label: "Abordagem", href: "#abordagem" },
        { label: "Serviços", href: "#servicos" },
        { label: "FAQ", href: "#faq" },
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
