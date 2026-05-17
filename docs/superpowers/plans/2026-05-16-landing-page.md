# Landing Page Ana Julia Vognach — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir a landing page completa de Ana Julia Vognach — psicóloga clínica — com foco em conversão via WhatsApp, experiência mobile-first e estética editorial.

**Architecture:** Next.js 15 App Router com conteúdo centralizado em `site-copy.ts`. Cada seção é um Server Component independente. Componentes `use client` apenas onde necessário (nav mobile, accordions, analytics, fade-in).

**Tech Stack:** Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui (Accordion) · Lucide React · Google Analytics · next/font · next/image

---

## Mapa de Arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/app/layout.tsx` | Fontes, metadata base, GA script, WhatsApp float |
| `src/app/page.tsx` | Composição das seções em ordem |
| `src/app/globals.css` | Reset, tokens CSS, keyframe fade-in |
| `src/content/site-copy.ts` | Todo o conteúdo textual do site, tipado |
| `src/lib/constants.ts` | WhatsApp URL + mensagens |
| `src/lib/analytics.ts` | Helpers para eventos GA |
| `src/lib/use-fade-in.ts` | Hook IntersectionObserver para fade-in |
| `src/components/ui/section-container.tsx` | Wrapper max-width + padding |
| `src/components/ui/whatsapp-button.tsx` | Botão WhatsApp reutilizável |
| `src/components/ui/whatsapp-float.tsx` | Botão flutuante fixo |
| `src/components/ui/fade-in.tsx` | Wrapper com fade-in via IntersectionObserver |
| `src/components/ui/scroll-tracker.tsx` | Rastreia scroll_75 para analytics |
| `src/components/sections/nav.tsx` | Navegação sticky com hamburger mobile |
| `src/components/sections/hero.tsx` | Hero 60/40 com foto IMG_8209 |
| `src/components/sections/about.tsx` | Sobre com trajetória expansível inline |
| `src/components/sections/approach.tsx` | Seção abordagem clínica |
| `src/components/sections/services.tsx` | Accordion de 7 serviços + foto |
| `src/components/sections/mission.tsx` | Seção impacto oliva escuro |
| `src/components/sections/testimonials.tsx` | 3 cards de depoimentos |
| `src/components/sections/faq.tsx` | Accordion de 5 FAQs |
| `src/components/sections/footer.tsx` | Rodapé preto |

---

## Task 1: Scaffold do projeto Next.js

**Files:**
- Cria toda a estrutura base do Next.js 15

- [ ] **Scaffold com create-next-app**

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --eslint \
  --import-alias "@/*" \
  --no-git
```

Quando perguntar sobre Turbopack, responda **Yes**.

- [ ] **Verificar versão do Tailwind instalada**

```bash
cat package.json | grep tailwindcss
```

Se for `"tailwindcss": "^4.*"` → Tailwind v4 (configuração via CSS). Se for `"tailwindcss": "^3.*"` → Tailwind v3 (configuração via `tailwind.config.ts`). Anote a versão — impacta a Task 3.

- [ ] **Limpar boilerplate desnecessário**

Apague o conteúdo de `src/app/page.tsx` e substitua por:

```tsx
export default function Home() {
  return <main>em construção</main>
}
```

Apague `src/app/page.module.css` se existir. Mantenha `globals.css`.

- [ ] **Verificar que o projeto roda**

```bash
npm run dev
```

Acesse `http://localhost:3000` e confirme que aparece "em construção" sem erros no terminal.

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 project"
```

---

## Task 2: Instalar dependências

**Files:**
- `package.json` (atualizado)
- `components.json` (criado pelo shadcn)

- [ ] **Instalar shadcn/ui**

```bash
npx shadcn@latest init
```

Nas perguntas:
- Style: **Default**
- Base color: **Neutral**
- CSS variables: **Yes**

- [ ] **Instalar componentes shadcn necessários**

```bash
npx shadcn@latest add accordion
```

- [ ] **Verificar instalação**

```bash
ls src/components/ui/
```

Deve conter `accordion.tsx`.

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: install shadcn/ui with accordion component"
```

---

## Task 3: Design tokens — cores, tipografia e animações

**Files:**
- `src/app/globals.css`
- `tailwind.config.ts` (se Tailwind v3) ou nenhum arquivo extra (se Tailwind v4)

### Se Tailwind v4:

- [ ] **Adicionar tokens em globals.css**

Substitua o conteúdo de `src/app/globals.css` por:

```css
@import "tailwindcss";

@theme {
  --color-offwhite: #FDFBF7;
  --color-stone: #F3F0EB;
  --color-preto: #111111;
  --color-oliva: #4A5D4E;
  --color-oliva-escuro: #3D4D40;
  --color-cinza: #555555;
  --color-linhas: #E5E5E5;

  --font-heading: var(--font-playfair);
  --font-body: var(--font-inter);
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fade-in-up 0.6s ease forwards;
}

.fade-hidden {
  opacity: 0;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #FDFBF7;
  color: #111111;
  font-family: var(--font-inter), sans-serif;
}
```

### Se Tailwind v3:

- [ ] **Adicionar tokens em tailwind.config.ts**

```ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        offwhite: "#FDFBF7",
        stone: "#F3F0EB",
        preto: "#111111",
        oliva: "#4A5D4E",
        "oliva-escuro": "#3D4D40",
        cinza: "#555555",
        linhas: "#E5E5E5",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Adicionar keyframes e utilitários em globals.css**

Adicione ao final de `src/app/globals.css`:

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fade-in-up 0.6s ease forwards;
}

.fade-hidden {
  opacity: 0;
}

html {
  scroll-behavior: smooth;
}
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add design tokens and fade-in animation"
```

---

## Task 4: Fontes e layout base

**Files:**
- `src/app/layout.tsx`

- [ ] **Configurar Playfair Display e Inter via next/font**

Substitua `src/app/layout.tsx` por:

```tsx
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Ana Julia Vognach | Psicóloga Clínica em Florianópolis",
  description:
    "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho. CRP 12/30269.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-offwhite font-body antialiased">{children}</body>
    </html>
  )
}
```

- [ ] **Verificar que as fontes carregam**

```bash
npm run dev
```

Inspecione no browser: o body deve ter as variáveis CSS `--font-inter` e `--font-playfair` disponíveis.

- [ ] **Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: configure Playfair Display and Inter via next/font"
```

---

## Task 5: Conteúdo — site-copy.ts

**Files:**
- `src/content/site-copy.ts` (criar)

- [ ] **Criar arquivo de conteúdo tipado**

Crie `src/content/site-copy.ts`:

```ts
export const heroCopy = {
  label: "Psicóloga Clínica · CRP 12/30269",
  title: "Ana Julia Vognach",
  subtitle:
    "Espaço de escuta profunda e suporte técnico especializado para quem busca segurança e sentido diante das exigências da vida moderna, do trabalho e da parentalidade.",
  cta: "Agendar conversa inicial (sem compromisso)",
  italicHighlight:
    "Você sente que está tentando equilibrar múltiplos papéis, mas vive sob uma sensação constante de esgotamento ou fragmentação?",
  supportText:
    "As pressões do trabalho não terminam quando você chega em casa, e os desafios da parentalidade reverberam na sua carreira. Minha atuação oferece uma visão sistêmica para que você não precise atravessar esses processos sozinha(o), unindo o rigor técnico ao acolhimento necessário para:",
  supportList: [
    "Manejar o estresse e prevenir o esgotamento profissional (Burnout).",
    "Lidar com a ambivalência entre carreira, identidade e maternidade.",
    "Atravessar processos de luto e transições de vida com suporte especializado.",
  ],
}

export const aboutCopy = {
  label: "Sobre",
  title: "Quem é Ana Julia Vognach",
  content:
    "Psicóloga, Especialista em Saúde Mental e Mãe.\n\nUnindo a densidade da Residência Hospitalar a mais de 5 anos de experiência na gestão de saúde mental corporativa, ajudo adultos a (re)conquistarem segurança emocional para viver com mais consciência e leveza.\n\nMinha prática é pautada no acolhimento genuíno e na escuta ativa, integrando o rigor técnico a orientações práticas para a vida real. Como mãe e profissional, compreendo as pressões que a carreira e a parentalidade impõem, oferecendo o suporte necessário para que você atravesse seus desafios com clareza.",
  expandCta: "Conheça mais sobre a minha trajetória",
  trajectory: {
    intro:
      "Olá, eu sou a Ana Julia Vognach. Sou psicóloga clínica e especialista em compreender as conexões profundas entre a vida pessoal e as exigências do trabalho.",
    sections: [
      {
        title: "Minha Trajetória: Do Hospital ao Corporativo",
        content:
          "Minha jornada na Psicologia foi construída em cenários de alta complexidade. Por meio da Residência Multiprofissional, atuei em ambientes hospitalares e acompanhei de perto os ciclos de vida, do nascimento ao luto.\n\nEssas experiências lapidaram o meu olhar e a minha escuta: aprendi que, mesmo nas situações mais difíceis, é possível construir caminhos de dignidade e sentido.\n\nAo longo de 5 anos, mergulhei na área da Saúde Mental do Trabalhador. Atuei em grandes empresas, geri projetos, ações em saúde e equipes de psicologia. Ali, compreendi na prática como as pressões por produtividade e as dinâmicas de trabalho podem impactar a nossa saúde mental e a nossa identidade pessoal e profissional.",
      },
      {
        title: "A Travessia entre a Maternidade e a Clínica",
        content:
          "Hoje, além da minha bagagem técnica, trago comigo a experiência da maternidade. Vivi na pele a ambivalência de assumir um cargo de gestão enquanto atravessava a licença-maternidade e, ao mesmo tempo, aprendia a ser mãe.\n\nFoi nesse lugar de transformações que encontrei a coragem de fazer uma escolha: a de deixar a gestão corporativa e redirecionar minha energia para a minha clínica e a maternidade. Uma escolha pautada pelo que considero essencial na Psicologia: o respeito ao tempo de cada processo e aos afetos que nos sustentam.\n\nConheço o medo do desconhecido, a ansiedade de equilibrar múltiplos papéis e o desafio de redescobrir quem somos quando a vida ganha novos contornos. Hoje, utilizo toda essa bagagem técnica e humana para oferecer um espaço onde a sua história é vista de forma integral.",
      },
    ],
    cta: "Agendar uma conversa com Ana Julia",
  },
}

export const approachCopy = {
  label: "Como trabalho",
  title: "Como eu trabalho",
  content:
    "Defendo que a psicoterapia não deve ser apenas um lugar de fala, mas um espaço de construção conjunta. Minha prática une a densidade clínica com acolhimento genuíno, escuta ativa e orientações práticas.\n\nSeja para lidar com o esgotamento profissional, elaborar um luto ou encontrar o seu lugar em uma nova fase da vida, estou aqui para caminharmos juntos em busca de mais leveza, presença e sentido.",
  cta: "Agendar uma conversa com Ana Julia",
}

export const servicesCopy = {
  label: "Serviços",
  title: "Serviços",
  cta: "Agendar atendimento",
  items: [
    {
      title: "Atendimento Psicológico Online",
      content:
        "Psicoterapia individual para adultos realizada de forma remota, com o mesmo rigor ético e profundidade do presencial, oferecendo flexibilidade e segurança para o cuidado com a saúde mental onde quer que você esteja.",
    },
    {
      title: "Psicoterapia para Adultos",
      content:
        "Atendimento clínico individual com foco em suporte emocional, autoconhecimento e no manejo de questões fundamentais da vida, como ansiedade, estresse e conflitos pessoais. Um espaço seguro para desenvolver segurança emocional e clareza diante de decisões importantes.",
    },
    {
      title: "Clínica do Trabalho e Saúde Mental",
      content:
        "Atendimento especializado nos impactos do trabalho na saúde mental. Foco no acolhimento de sofrimentos relacionados a exigências, pressões e conflitos no ambiente de trabalho, visando a prevenção do adoecimento e o fortalecimento do bem-estar emocional do profissional.",
    },
    {
      title: "Acompanhamento em Burnout",
      content:
        "Intervenção clínica especializada para o esgotamento profissional (Burnout). Trabalho direcionado à recuperação da energia vital, manejo do estresse crônico e construção de novas formas de se posicionar diante das demandas profissionais, respeitando os limites da saúde psíquica.",
    },
    {
      title: "Psicoterapia para Mães",
      content:
        "Espaço dedicado às mulheres na travessia da maternidade, desde a gestação até o retorno ao trabalho pós-licença. Foco nos desafios da nova identidade, na ambivalência dos sentimentos e na busca por equilíbrio entre os múltiplos papéis (mãe, mulher e profissional).",
    },
    {
      title: "Luto e Crises de Transição",
      content:
        "Suporte especializado para pessoas em processos de perda, luto ou grandes mudanças de vida. Através de uma escuta aprofundada vinda da experiência hospitalar, auxilio na elaboração da dor e na ressignificação da trajetória pessoal diante de crises e rupturas.",
    },
    {
      title: "Saúde Mental no Trabalho — Para Empresas e Instituições",
      content:
        "Palestras, Workshops e Consultoria em Saúde Mental. O foco é humanizar as relações de trabalho e prevenir o adoecimento psíquico dos indivíduos e organizações.",
    },
  ],
}

export const missionCopy = {
  label: "Missão",
  title: "Minha Missão",
  content:
    "Minha missão é oferecer o suporte técnico e humano necessário para que você possa atravessar e lidar com os seus desafios com segurança. Através de uma escuta ativa e orientações práticas, ajudo você a fazer escolhas conscientes e a (re)conquistar sua clareza emocional em todas as esferas da vida.",
  cta: "Agendar atendimento com Ana Julia",
}

export const testimonialsCopy = {
  title: "O que dizem sobre o meu acompanhamento",
  rating: "5,0",
  items: [
    {
      quote:
        "A Ana Julia me ajudou a enxergar caminhos que eu não via. Um espaço de escuta genuína e acolhedora, onde me senti completamente segura para falar.",
      author: "Paciente verificada",
    },
    {
      quote:
        "Uma experiência transformadora. A cada sessão, saio com mais clareza e leveza para enfrentar os desafios do dia a dia.",
      author: "Paciente verificada",
    },
    {
      quote:
        "Encontrei na Ana Julia o suporte que precisava para atravessar um momento muito difícil da minha vida. Sou imensamente grata.",
      author: "Paciente verificada",
    },
  ],
}

export const faqCopy = {
  title: "Dúvidas Frequentes",
  cta: "Tenho uma dúvida específica",
  items: [
    {
      question: "O que é psicoterapia e será que eu preciso?",
      answer:
        "A psicoterapia é um espaço de acolhimento que serve para todas as pessoas; não precisa existir um \"problema\" para iniciar. É um espaço para conhecer mais sobre si, se entender e aprender a se autorregular para viver com mais consciência, presença e leveza.",
    },
    {
      question: "Como funciona o atendimento psicológico online?",
      answer:
        "A psicoterapia online é uma excelente forma de otimização do tempo. Você realiza de onde desejar, desde que esteja em um ambiente silencioso, privativo e seguro. O atendimento ocorre via chamada de vídeo através de um link seguro enviado previamente. É simples, ético e eficaz.",
    },
    {
      question: "Como é feito o pagamento?",
      answer:
        "O pagamento é realizado via PIX ou transferência bancária. Trabalho com modalidades por sessão ou pacotes, combinados em nossa primeira conversa. Entrego recibos para que você possa solicitar reembolso no seu plano de saúde, caso ele ofereça essa modalidade.",
    },
    {
      question: "Podemos conversar antes de agendar?",
      answer:
        "Sim. Ofereço uma breve conversa inicial sem compromisso. Esse é um momento para você me conhecer, tirar dúvidas e sentir se o meu modo de trabalho ressoa com o que você busca.",
    },
    {
      question: "O que esperar do nosso primeiro encontro?",
      answer:
        "O foco é o acolhimento. Não há roteiro rígido ou pressão para \"saber por onde começar\". É um espaço para nos conhecermos e entendermos como posso te acompanhar nessa jornada.",
    },
  ],
}

export const footerCopy = {
  name: "Psicóloga Ana Julia Vognach",
  crp: "CRP/SC 12/30269",
  instagram: "@psicoanavognach",
  instagramUrl: "https://instagram.com/psicoanavognach",
  email: "anajuliavognach93@gmail.com",
}

export const navCopy = {
  name: "Ana Julia Vognach",
  links: [
    { label: "Sobre", href: "#sobre" },
    { label: "Serviços", href: "#servicos" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: "Agendar →",
}
```

- [ ] **Verificar que o TypeScript compila sem erros**

```bash
npx tsc --noEmit
```

Esperado: sem saída (zero erros).

- [ ] **Commit**

```bash
git add src/content/site-copy.ts
git commit -m "feat: add typed site content from CONTENT_SOURCE.md"
```

---

## Task 6: Constants e Analytics helpers

**Files:**
- `src/lib/constants.ts` (criar)
- `src/lib/analytics.ts` (criar)

- [ ] **Criar constants.ts**

Crie `src/lib/constants.ts`:

```ts
const WHATSAPP_NUMBER = "5551982831876"

export const WHATSAPP_MESSAGES = {
  schedule:
    "Olá, Ana Julia. Vi seu site e gostaria de agendar uma conversa inicial.",
  question:
    "Olá, Ana Julia. Vi seu site e gostaria de tirar uma dúvida sobre como funciona o seu acompanhamento antes de agendar.",
}

export function whatsappUrl(message: keyof typeof WHATSAPP_MESSAGES): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGES[message]
  )}`
}
```

- [ ] **Criar analytics.ts**

Crie `src/lib/analytics.ts`:

```ts
declare const gtag: (
  command: string,
  action: string,
  params?: Record<string, string>
) => void

export function trackWhatsappClick(label: string) {
  if (typeof gtag !== "undefined") {
    gtag("event", "whatsapp_click", { event_label: label })
  }
}

export function trackFaqExpand(question: string) {
  if (typeof gtag !== "undefined") {
    gtag("event", "faq_expand", { event_label: question })
  }
}

export function trackServicesExpand(service: string) {
  if (typeof gtag !== "undefined") {
    gtag("event", "services_expand", { event_label: service })
  }
}

export function trackScroll75() {
  if (typeof gtag !== "undefined") {
    gtag("event", "scroll_75")
  }
}
```

- [ ] **Criar use-fade-in.ts**

Crie `src/lib/use-fade-in.ts`:

```ts
"use client"

import { useEffect, useRef } from "react"

export function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove("fade-hidden")
          el.classList.add("fade-in-up")
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
```

- [ ] **Verificar que o TypeScript compila**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Commit**

```bash
git add src/lib/
git commit -m "feat: add whatsapp helpers, analytics events, and fade-in hook"
```

---

## Task 7: Componentes UI base

**Files:**
- `src/components/ui/section-container.tsx` (criar)
- `src/components/ui/whatsapp-button.tsx` (criar)
- `src/components/ui/whatsapp-float.tsx` (criar)

- [ ] **Criar SectionContainer**

Crie `src/components/ui/section-container.tsx`:

```tsx
import { cn } from "@/lib/utils"

interface SectionContainerProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function SectionContainer({
  children,
  className,
  id,
}: SectionContainerProps) {
  return (
    <section id={id} className={cn("w-full", className)}>
      <div className="mx-auto w-full max-w-[1200px] px-5 py-20 md:px-8 md:py-[120px]">
        {children}
      </div>
    </section>
  )
}
```

- [ ] **Criar WhatsAppButton**

Crie `src/components/ui/whatsapp-button.tsx`:

```tsx
"use client"

import { trackWhatsappClick } from "@/lib/analytics"
import { whatsappUrl, WHATSAPP_MESSAGES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface WhatsAppButtonProps {
  messageKey: keyof typeof WHATSAPP_MESSAGES
  label: string
  className?: string
  variant?: "primary" | "inverse"
}

export function WhatsAppButton({
  messageKey,
  label,
  className,
  variant = "primary",
}: WhatsAppButtonProps) {
  return (
    <a
      href={whatsappUrl(messageKey)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir WhatsApp: ${label}`}
      onClick={() => trackWhatsappClick(label)}
      className={cn(
        "inline-block rounded-[10px] px-6 py-3.5 text-sm font-medium transition-all duration-200 hover:-translate-y-px hover:opacity-[0.94]",
        variant === "primary" &&
          "bg-oliva text-offwhite",
        variant === "inverse" &&
          "bg-offwhite text-preto",
        className
      )}
    >
      {label}
    </a>
  )
}

// Nota: use hover:opacity-[0.94] — Tailwind não tem opacity-94 por padrão
```

- [ ] **Criar WhatsAppFloat**

Crie `src/components/ui/whatsapp-float.tsx`:

```tsx
"use client"

import { trackWhatsappClick } from "@/lib/analytics"
import { whatsappUrl } from "@/lib/constants"

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl("schedule")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar via WhatsApp"
      onClick={() => trackWhatsappClick("float_button")}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-200 hover:scale-105"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  )
}
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/components/ui/
git commit -m "feat: add SectionContainer, WhatsAppButton, and WhatsAppFloat"
```

---

## Task 8: Navegação

**Files:**
- `src/components/sections/nav.tsx` (criar)

- [ ] **Criar Nav**

Crie `src/components/sections/nav.tsx`:

```tsx
"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { navCopy } from "@/content/site-copy"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-linhas bg-offwhite">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 md:px-8">
        <span className="font-heading text-base font-semibold text-preto">
          {navCopy.name}
        </span>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {navCopy.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-cinza transition-colors hover:text-preto"
            >
              {link.label}
            </a>
          ))}
          <WhatsAppButton messageKey="schedule" label={navCopy.cta} />
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex items-center md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? (
            <X className="h-5 w-5 text-preto" />
          ) : (
            <Menu className="h-5 w-5 text-preto" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-linhas bg-offwhite px-5 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4" aria-label="Menu mobile">
            {navCopy.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base text-cinza"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <WhatsAppButton
              messageKey="schedule"
              label={navCopy.cta}
              className="mt-2 text-center"
            />
          </nav>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Adicionar Nav ao layout.tsx**

Atualize `src/app/layout.tsx` para incluir a Nav e o WhatsAppFloat:

```tsx
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Nav } from "@/components/sections/nav"
import { WhatsAppFloat } from "@/components/ui/whatsapp-float"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Ana Julia Vognach | Psicóloga Clínica em Florianópolis",
  description:
    "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho. CRP 12/30269.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-offwhite font-body antialiased">
        <Nav />
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  )
}
```

- [ ] **Testar no browser**

```bash
npm run dev
```

Verifique: nav aparece no topo, links visíveis no desktop, hamburger no mobile, botão WhatsApp flutuante no canto inferior direito.

- [ ] **Commit**

```bash
git add src/components/sections/nav.tsx src/app/layout.tsx
git commit -m "feat: add sticky nav with mobile hamburger menu"
```

---

## Task 9: Hero section

**Files:**
- `src/components/sections/hero.tsx` (criar)

- [ ] **Criar Hero**

Crie `src/components/sections/hero.tsx`:

```tsx
import Image from "next/image"
import { heroCopy } from "@/content/site-copy"
import { SectionContainer } from "@/components/ui/section-container"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export function Hero() {
  return (
    <SectionContainer className="bg-offwhite">
      <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
        {/* Text — 60% */}
        <div className="flex flex-col gap-6 md:flex-[1.5]">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-oliva">
            {heroCopy.label}
          </p>
          <h1
            className="font-heading text-[clamp(2.75rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-preto"
          >
            {heroCopy.title}
          </h1>
          <p className="text-base leading-[1.9] text-cinza">
            {heroCopy.subtitle}
          </p>
          <p className="border-l-2 border-oliva pl-4 text-base italic leading-[1.9] text-preto">
            {heroCopy.italicHighlight}
          </p>
          <p className="text-base leading-[1.9] text-cinza">
            {heroCopy.supportText}
          </p>
          <ul className="flex flex-col gap-2">
            {heroCopy.supportList.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-[1.7] text-cinza">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-oliva" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-2">
            <WhatsAppButton messageKey="schedule" label={heroCopy.cta} />
          </div>
        </div>

        {/* Photo — 40% */}
        <div className="relative w-full overflow-hidden rounded-2xl md:flex-[1] md:self-stretch">
          <Image
            src="/fotos/IMG_8209.jpg"
            alt="Ana Julia Vognach, psicóloga clínica"
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Copiar fotos para public/**

```bash
cp -r fotos public/fotos
```

- [ ] **Testar no browser**

```bash
npm run dev
```

Verifique: hero renderiza com título, subtítulo, lista, botão e foto. No mobile, foto aparece abaixo do texto.

- [ ] **Commit**

```bash
git add src/components/sections/hero.tsx public/fotos/
git commit -m "feat: add Hero section with IMG_8209"
```

---

## Task 10: About section

**Files:**
- `src/components/sections/about.tsx` (criar)

- [ ] **Criar About com trajetória expansível**

Crie `src/components/sections/about.tsx`:

```tsx
"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { aboutCopy } from "@/content/site-copy"
import { SectionContainer } from "@/components/ui/section-container"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export function About() {
  const [expanded, setExpanded] = useState(false)

  return (
    <SectionContainer id="sobre" className="bg-stone">
      <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-16">
        {/* Text — 60% */}
        <div className="flex flex-col gap-6 md:flex-[1.5]">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-oliva">
            {aboutCopy.label}
          </p>
          <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] text-preto">
            {aboutCopy.title}
          </h2>
          {aboutCopy.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-base leading-[1.9] text-cinza">
              {paragraph}
            </p>
          ))}

          {/* Expand button */}
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="flex items-center gap-2 text-sm text-preto underline underline-offset-4 transition-colors hover:text-oliva"
          >
            {aboutCopy.expandCta}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>

          {/* Expanded trajectory */}
          {expanded && (
            <div className="flex flex-col gap-8 border-t border-linhas pt-6">
              <p className="text-base italic leading-[1.9] text-cinza">
                {aboutCopy.trajectory.intro}
              </p>
              {aboutCopy.trajectory.sections.map((section) => (
                <div key={section.title} className="flex flex-col gap-4">
                  <h3 className="font-heading text-xl font-semibold text-preto">
                    {section.title}
                  </h3>
                  {section.content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-base leading-[1.9] text-cinza">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
              <WhatsAppButton
                messageKey="schedule"
                label={aboutCopy.trajectory.cta}
              />
            </div>
          )}
        </div>

        {/* Photo — 40% */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl md:flex-[1]">
          <Image
            src="/fotos/IMG_8114.jpg"
            alt="Ana Julia Vognach em seu consultório"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Testar expansão**

No browser, clique em "Conheça mais sobre a minha trajetória" e verifique que o conteúdo expande/recolhe corretamente.

- [ ] **Commit**

```bash
git add src/components/sections/about.tsx
git commit -m "feat: add About section with inline trajectory expand"
```

---

## Task 11: Approach section

**Files:**
- `src/components/sections/approach.tsx` (criar)

- [ ] **Criar Approach**

Crie `src/components/sections/approach.tsx`:

```tsx
import { approachCopy } from "@/content/site-copy"
import { SectionContainer } from "@/components/ui/section-container"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export function Approach() {
  return (
    <SectionContainer className="bg-offwhite">
      <div className="mx-auto max-w-2xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-oliva">
          {approachCopy.label}
        </p>
        <h2 className="font-heading mb-8 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] text-preto">
          {approachCopy.title}
        </h2>
        {approachCopy.content.split("\n\n").map((paragraph, i) => (
          <p key={i} className="mb-6 text-base leading-[1.9] text-cinza">
            {paragraph}
          </p>
        ))}
        <WhatsAppButton messageKey="schedule" label={approachCopy.cta} />
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/sections/approach.tsx
git commit -m "feat: add Approach section"
```

---

## Task 12: Services section

**Files:**
- `src/components/sections/services.tsx` (criar)

- [ ] **Criar Services com accordion e foto**

Crie `src/components/sections/services.tsx`:

```tsx
"use client"

import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { servicesCopy } from "@/content/site-copy"
import { SectionContainer } from "@/components/ui/section-container"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { trackServicesExpand } from "@/lib/analytics"

export function Services() {
  return (
    <SectionContainer id="servicos" className="bg-stone">
      <div className="flex flex-col gap-12 md:flex-row md:gap-16">
        {/* Accordion — 60% */}
        <div className="flex flex-col gap-8 md:flex-[1.5]">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-oliva">
              {servicesCopy.label}
            </p>
            <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] text-preto">
              {servicesCopy.title}
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {servicesCopy.items.map((item, index) => (
              <AccordionItem
                key={item.title}
                value={`item-${index}`}
                className="border-linhas"
              >
                <AccordionTrigger
                  className="text-left text-base font-medium text-preto hover:text-oliva hover:no-underline"
                  onClick={() => trackServicesExpand(item.title)}
                >
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-[1.7] text-cinza">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <WhatsAppButton messageKey="schedule" label={servicesCopy.cta} />
        </div>

        {/* Photo — 40% | aparece acima no mobile (order-first), à direita no desktop */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl md:flex-[1] md:self-start md:sticky md:top-24 order-first md:order-last">
          <Image
            src="/fotos/IMG_8194.jpg"
            alt="Consultório de Ana Julia Vognach"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Testar accordion**

No browser, verifique que ao clicar em um item do accordion outro fecha automaticamente (type="single"). Verifique que o evento `services_expand` dispara (console do GA ou `console.log` temporário).

- [ ] **Commit**

```bash
git add src/components/sections/services.tsx
git commit -m "feat: add Services section with accordion and analytics"
```

---

## Task 13: Mission section

**Files:**
- `src/components/sections/mission.tsx` (criar)

- [ ] **Criar Mission**

Crie `src/components/sections/mission.tsx`:

```tsx
import { missionCopy } from "@/content/site-copy"
import { SectionContainer } from "@/components/ui/section-container"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export function Mission() {
  return (
    <SectionContainer className="bg-oliva-escuro">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-offwhite/60">
          {missionCopy.label}
        </p>
        <h2 className="font-heading mb-8 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] text-offwhite">
          {missionCopy.title}
        </h2>
        <p className="mb-10 text-base leading-[1.9] text-offwhite/80">
          {missionCopy.content}
        </p>
        <WhatsAppButton
          messageKey="schedule"
          label={missionCopy.cta}
          variant="inverse"
        />
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/sections/mission.tsx
git commit -m "feat: add Mission section with dark olive background"
```

---

## Task 14: Testimonials section

**Files:**
- `src/components/sections/testimonials.tsx` (criar)

- [ ] **Criar Testimonials**

Crie `src/components/sections/testimonials.tsx`:

```tsx
import { testimonialsCopy } from "@/content/site-copy"
import { SectionContainer } from "@/components/ui/section-container"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function Testimonials() {
  return (
    <SectionContainer className="bg-offwhite">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] text-preto">
            {testimonialsCopy.title}
          </h2>
          <div className="flex items-center gap-2">
            <GoogleIcon />
            <span className="text-sm font-semibold text-preto">
              {testimonialsCopy.rating}
            </span>
            <span className="text-sm text-[#FBBC05]">★★★★★</span>
            <span className="text-sm text-cinza">· Google Avaliações</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonialsCopy.items.map((item) => (
            <div
              key={item.author}
              className="flex flex-col gap-4 rounded-xl bg-stone p-6"
            >
              <span className="text-sm text-[#FBBC05]">★★★★★</span>
              <p className="flex-1 text-sm italic leading-[1.7] text-cinza">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="text-xs text-cinza/70">— {item.author}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/sections/testimonials.tsx
git commit -m "feat: add Testimonials section with Google badge and cards"
```

---

## Task 15: FAQ section

**Files:**
- `src/components/sections/faq.tsx` (criar)

- [ ] **Criar FAQ**

Crie `src/components/sections/faq.tsx`:

```tsx
"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqCopy } from "@/content/site-copy"
import { SectionContainer } from "@/components/ui/section-container"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { trackFaqExpand } from "@/lib/analytics"

export function FAQ() {
  return (
    <SectionContainer id="faq" className="bg-stone">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-heading mb-10 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] text-preto">
          {faqCopy.title}
        </h2>
        <Accordion type="single" collapsible className="mb-10 w-full">
          {faqCopy.items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="border-linhas"
            >
              <AccordionTrigger
                className="text-left text-base font-medium text-preto hover:text-oliva hover:no-underline"
                onClick={() => trackFaqExpand(item.question)}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-[1.7] text-cinza">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <WhatsAppButton messageKey="question" label={faqCopy.cta} />
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/sections/faq.tsx
git commit -m "feat: add FAQ section with accordion and analytics"
```

---

## Task 16: Footer section

**Files:**
- `src/components/sections/footer.tsx` (criar)

- [ ] **Criar Footer**

Crie `src/components/sections/footer.tsx`:

```tsx
import { Instagram, Mail } from "lucide-react"
import { footerCopy } from "@/content/site-copy"

export function Footer() {
  return (
    <footer className="w-full bg-preto">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-heading text-base font-semibold text-offwhite">
            {footerCopy.name}
          </p>
          <p className="mt-1 text-sm text-offwhite/50">{footerCopy.crp}</p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <a
            href={footerCopy.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Ana Julia Vognach"
            className="flex items-center gap-2 text-sm text-offwhite/60 transition-colors hover:text-offwhite"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            {footerCopy.instagram}
          </a>
          <a
            href={`mailto:${footerCopy.email}`}
            aria-label={`Enviar e-mail para ${footerCopy.email}`}
            className="flex items-center gap-2 text-sm text-offwhite/60 transition-colors hover:text-offwhite"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {footerCopy.email}
          </a>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/sections/footer.tsx
git commit -m "feat: add Footer section"
```

---

## Task 17: Composição final da página

**Files:**
- `src/app/page.tsx`

- [ ] **Montar page.tsx com todas as seções na ordem correta**

Substitua `src/app/page.tsx`:

```tsx
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Approach } from "@/components/sections/approach"
import { Services } from "@/components/sections/services"
import { Mission } from "@/components/sections/mission"
import { Testimonials } from "@/components/sections/testimonials"
import { FAQ } from "@/components/sections/faq"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Approach />
      <Services />
      <Mission />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  )
}
```

- [ ] **Verificar página completa no browser**

```bash
npm run dev
```

Percorra a página inteira verificando: ordem das seções, cores alternadas, textos corretos, fotos, accordions, CTAs WhatsApp.

- [ ] **Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble complete landing page"
```

---

## Task 18: Fade-in no scroll

**Files:**
- `src/lib/use-fade-in.ts` (já criado na Task 6)
- Modificar cada seção para usar o hook

- [ ] **Criar componente FadeIn reutilizável**

Crie `src/components/ui/fade-in.tsx`:

```tsx
"use client"

import { useFadeIn } from "@/lib/use-fade-in"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useFadeIn()
  return (
    <div
      ref={ref}
      className={cn("fade-hidden", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
```

- [ ] **Aplicar FadeIn nas seções**

Envolva os elementos principais de cada seção em `<FadeIn>`. Exemplo em `hero.tsx`:

```tsx
import { FadeIn } from "@/components/ui/fade-in"

// Dentro do retorno do Hero, envolva o bloco de texto:
<FadeIn>
  <div className="flex flex-col gap-6 md:flex-[1.5]">
    {/* ... conteúdo ... */}
  </div>
</FadeIn>

// E a foto com delay:
<FadeIn delay={150}>
  <div className="relative ...">
    <Image ... />
  </div>
</FadeIn>
```

Aplique o mesmo padrão em `about.tsx`, `approach.tsx`, `services.tsx`, `mission.tsx`, `testimonials.tsx`, `faq.tsx`.

- [ ] **Testar fade-in**

No browser, faça scroll lento pela página. Os elementos devem aparecer suavemente ao entrar na viewport.

- [ ] **Commit**

```bash
git add src/components/ui/fade-in.tsx src/components/sections/
git commit -m "feat: add scroll fade-in to all sections"
```

---

## Task 19: SEO e Metadata completa

**Files:**
- `src/app/layout.tsx`

- [ ] **Adicionar metadata completa com OpenGraph**

Atualize o objeto `metadata` em `layout.tsx`:

```ts
export const metadata: Metadata = {
  title: "Ana Julia Vognach | Psicóloga Clínica em Florianópolis",
  description:
    "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho. CRP 12/30269.",
  keywords: [
    "psicóloga florianópolis",
    "psicóloga campeche",
    "saúde mental e trabalho",
    "psicoterapia para adultos",
    "equilíbrio carreira e maternidade",
    "psicologia sistêmica",
    "supervisão clínica para psicólogos",
  ],
  openGraph: {
    title: "Ana Julia Vognach | Psicóloga Clínica em Florianópolis",
    description:
      "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho.",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

- [ ] **Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add complete SEO metadata with OpenGraph"
```

---

## Task 20: Google Analytics

**Files:**
- `src/app/layout.tsx`

- [ ] **Adicionar script do Google Analytics**

Você precisará do `GA_MEASUREMENT_ID` (formato `G-XXXXXXXXXX`) do painel do Google Analytics. Adicione em `layout.tsx`:

```tsx
import Script from "next/script"

// Adicione dentro de <head> via next/script, após os metadados:
// No body, antes do Nav:
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
  `}
</Script>
```

- [ ] **Criar .env.local**

```bash
echo "NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX" > .env.local
```

Substitua `G-XXXXXXXXXX` pelo ID real. Adicione `.env.local` ao `.gitignore` se não estiver.

- [ ] **Adicionar evento scroll_75**

Crie `src/components/ui/scroll-tracker.tsx`:

```tsx
"use client"

import { useEffect, useRef } from "react"
import { trackScroll75 } from "@/lib/analytics"

export function ScrollTracker() {
  const fired = useRef(false)

  useEffect(() => {
    function handleScroll() {
      if (fired.current) return
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (scrolled / total >= 0.75) {
        fired.current = true
        trackScroll75()
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return null
}
```

Adicione `<ScrollTracker />` dentro do `<body>` em `layout.tsx`.

- [ ] **Commit**

```bash
git add src/app/layout.tsx src/components/ui/scroll-tracker.tsx .gitignore
git commit -m "feat: add Google Analytics and scroll_75 tracking"
```

---

## Task 21: Build e verificação final

- [ ] **Rodar build de produção**

```bash
npm run build
```

Esperado: zero erros. Se houver erros de TypeScript ou ESLint, corrija antes de continuar.

- [ ] **Verificar bundle size**

```bash
npm run build 2>&1 | grep "First Load JS"
```

A página principal deve ter First Load JS abaixo de 150kB.

- [ ] **Testar no mobile**

No Chrome DevTools, ative o modo responsivo (375px de largura). Verifique:
- Nav vira hamburger
- Hero empilha (foto abaixo do texto)
- Accordion funciona com toque
- Botão WhatsApp flutuante não sobrepõe conteúdo importante
- Textos legíveis sem zoom

- [ ] **Commit final**

```bash
git add -A
git commit -m "feat: complete landing page MVP"
```

---

## Notas de Implementação

- **Depoimentos placeholder**: Os textos em `testimonialsCopy.items` são placeholders. Substituir pelos depoimentos reais do Google quando disponíveis.
- **GA_MEASUREMENT_ID**: Obter no painel Google Analytics → Admin → Streams de dados → ID de medição.
- **Fotos**: Certifique-se de que `public/fotos/` contém `IMG_8209.jpg`, `IMG_8114.jpg` e `IMG_8194.jpg`.
