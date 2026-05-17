# Design Spec — Landing Page Ana Julia Vognach
**Data:** 2026-05-16
**Status:** Aprovado

---

## Objetivo

Landing page profissional para a psicóloga clínica Ana Julia Vognach. Foco em conversão via WhatsApp, experiência mobile-first, estética editorial e acolhedora.

---

## Stack Técnica

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Componentes:** shadcn/ui
- **Ícones:** Lucide React
- **Deploy:** Vercel
- **Analytics:** Google Analytics

---

## Estrutura de Arquivos

```
src/
  app/
    page.tsx
    layout.tsx
    globals.css
  components/
    sections/
      hero.tsx
      about.tsx
      approach.tsx
      services.tsx
      mission.tsx
      testimonials.tsx
      faq.tsx
      footer.tsx
    ui/
      nav.tsx
      button.tsx
      accordion.tsx
      whatsapp-float.tsx
      section-container.tsx
  content/
    site-copy.ts
  lib/
    analytics.ts
    constants.ts
```

**Regra central:** nenhum texto hardcoded nos componentes. Todo conteúdo importado de `src/content/site-copy.ts`, que é a transcrição tipada de `CONTENT_SOURCE.md`.

---

## Design Visual

### Tipografia

| Função | Fonte | Características |
|---|---|---|
| Headings | Playfair Display | Editorial, elegante, densa |
| Body | Inter | Limpa, moderna, legível |

Carregadas via `next/font` — sem layout shift.

### Hierarquia tipográfica

| Elemento | CSS |
|---|---|
| Hero title | `clamp(2.75rem, 5vw, 5rem)` · weight 600 · `line-height: 1.02` · `letter-spacing: -0.04em` |
| Section titles | `clamp(2rem, 4vw, 3rem)` · weight 600 · `line-height: 1.1` |
| Body text | `1rem` · `line-height: 1.9` |
| Small text | `0.875rem` · `line-height: 1.7` |

### Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `offwhite` | `#FDFBF7` | Fundo principal |
| `stone` | `#F3F0EB` | Fundo seções alternadas |
| `preto` | `#111111` | Títulos, footer |
| `oliva` | `#4A5D4E` | CTAs, labels, ícones, bullets |
| `oliva-escuro` | `#3D4D40` | Fundo seção Missão |
| `cinza` | `#555555` | Body text |
| `linhas` | `#E5E5E5` | Borders, divisores |

### Botões (CTAs)

```css
background: #4A5D4E;
color: #FDFBF7;
border-radius: 10px;
padding: 14px 24px;
transition: all 0.2s ease;

/* hover */
opacity: 0.94;
transform: translateY(-1px);
```

### Layout e Espaçamento

- **Container:** `max-width: 1200px` · `padding-inline: 32px` (desktop) / `20px` (mobile)
- **Seções:** `padding-block: 120px` (desktop) / `80px` (mobile)
- Fundos das seções vão de borda a borda; conteúdo é centralizado dentro do container

---

## Estrutura da Página

### Navegação (sticky)

- Fundo `#FDFBF7` com borda inferior `#E5E5E5`
- Esquerda: nome "Ana Julia Vognach" (Playfair Display)
- Direita: links de âncora (Sobre · Serviços · FAQ) + botão CTA oliva "Agendar →"
- Mobile: hamburger menu

### Ordem das Seções

| # | Seção | Fundo | Notas |
|---|---|---|---|
| 1 | Hero | `#FDFBF7` | Layout 60/40 · foto `IMG_8209` |
| 2 | Sobre | `#F3F0EB` | Foto `IMG_8114` · trajetória expande inline |
| 3 | Abordagem | `#FDFBF7` | Texto editorial + CTA |
| 4 | Serviços | `#F3F0EB` | Accordion 7 itens · foto `IMG_8194` |
| 5 | Missão | `#3D4D40` | Texto claro · CTA off-white · seção de impacto |
| 6 | Depoimentos | `#FDFBF7` | Cards com placeholders · badge Google 5,0 |
| 7 | FAQ | `#F3F0EB` | Accordion 5 itens · CTA WhatsApp |
| 8 | Footer | `#111111` | Nome · CRP · Instagram · e-mail |
| — | Float | — | Botão WhatsApp fixo `bottom: 24px right: 24px` |

---

## Detalhes por Seção

### Hero

- Layout desktop: coluna de texto (60%) à esquerda + foto portrait (40%) à direita
- Layout mobile: empilhado (texto acima, foto abaixo)
- Foto: `fotos/IMG_8209.jpg`
- Conteúdo: título, subtítulo, italic highlight, lista de suporte, CTA primário

### Sobre

- Layout desktop: texto à esquerda (60%) + foto à direita (40%), mesmo padrão do Hero
- Layout mobile: empilhado (texto acima, foto abaixo)
- Foto: `fotos/IMG_8114.jpg`
- CTA "Conheça mais sobre a minha trajetória" → expande inline (accordion) com o conteúdo de `TRAJECTORY_EXPANDED_CONTENT`
- CTA WhatsApp ao final da trajetória expandida

### Abordagem

- Seção de texto puro, editorial
- CTA WhatsApp ao final

### Serviços

- Accordion com 7 itens (shadcn/ui) — apenas um item aberto por vez
- Desktop: foto `fotos/IMG_8194.jpg` à direita do accordion; Mobile: foto acima do accordion
- Evento analytics `services_expand` ao abrir cada item
- CTA WhatsApp ao final

### Missão

- Fundo `#3D4D40` (oliva escuro), texto `#FDFBF7`
- Seção de fechamento emocional, centralizada
- CTA com fundo `#FDFBF7` e texto `#111111`

### Depoimentos

- 3 cards com depoimentos reais do Google (placeholders no MVP, substituir quando textos reais forem coletados)
- Badge: ícone Google + nota 5,0 + estrelas douradas
- **Nota:** depoimentos reais serão adicionados posteriormente

### FAQ

- Accordion com 5 itens (shadcn/ui) — apenas um item aberto por vez
- Evento analytics `faq_expand` ao abrir cada item
- CTA WhatsApp com mensagem específica de dúvida

### Footer

- Fundo `#111111`
- Nome completo + CRP/SC 12/30269
- Instagram: @psicoanavognach
- E-mail: anajuliavognach93@gmail.com

### Botão WhatsApp Flutuante

- Posição: `fixed bottom-6 right-6`
- Sempre visível, sombra suave, sem animações exageradas
- Abre WhatsApp com mensagem de agendamento

---

## Comportamento e Animações

### Fade-in no scroll

- Implementado com CSS `@keyframes` + `IntersectionObserver` nativo
- Sem biblioteca externa
- Elementos entram suavemente ao entrar na viewport
- Aplicado a seções e blocos de conteúdo

### Accordions

- shadcn/ui `Accordion` com `type="single"` (um item por vez)
- Animação de abertura/fechamento suave via CSS

---

## WhatsApp

- Número: `+55 51 98283-1876`
- URL base: `https://wa.me/5551982831876`

| Contexto | Mensagem pré-preenchida |
|---|---|
| CTAs gerais / agendamento | `Olá, Ana Julia. Vi seu site e gostaria de agendar uma conversa inicial.` |
| FAQ / dúvidas | `Olá, Ana Julia. Vi seu site e gostaria de tirar uma dúvida sobre como funciona o seu acompanhamento antes de agendar.` |

---

## Analytics — Eventos

| Evento | Gatilho |
|---|---|
| `whatsapp_click` | Qualquer CTA de WhatsApp (inclui label do CTA) |
| `faq_expand` | Abertura de item no FAQ |
| `services_expand` | Abertura de item em Serviços |
| `scroll_75` | Usuário atinge 75% da página |

---

## SEO

**Metadata:** `title`, `description`, OpenGraph, favicon, `alt` em todas as imagens

**Keywords:**
- psicóloga florianópolis
- psicóloga campeche
- saúde mental e trabalho
- psicoterapia para adultos
- equilíbrio carreira e maternidade
- psicologia sistêmica
- supervisão clínica para psicólogos

---

## Performance

- Meta: Lighthouse ≥ 90
- `next/image` com `alt` descritivo em todas as fotos
- `next/font` para Playfair Display e Inter
- Mínimo de componentes `use client` — apenas onde necessário (accordion, analytics, IntersectionObserver)
- Sem bibliotecas de animação pesadas

---

## Acessibilidade

- Contraste AA garantido
- Navegação por teclado funcional
- Headings semânticos (`h1`, `h2`, `h3`)
- `aria-label` nos botões de WhatsApp e accordion
- `alt` text em todas as imagens

---

## Fora do Escopo (MVP)

- Blog / MDX
- CMS
- Dark mode
- Sistema de agenda online
- Backend / autenticação
- Formulários complexos
- Supervisão clínica como serviço separado (pode ser adicionada como item no accordion de Serviços futuramente)

---

## Fotos Mapeadas

| Seção | Arquivo |
|---|---|
| Hero | `fotos/IMG_8209.jpg` |
| Sobre | `fotos/IMG_8114.jpg` |
| Serviços | `fotos/IMG_8194.jpg` |
