# IMPLEMENTATION_PLAN.md

# Projeto — Landing Page Psicóloga Ana Julia Vognach

## Objetivo

Criar uma landing page moderna, minimalista, acolhedora e profissional para o consultório clínico da Ana Julia Vognach.

O foco principal do projeto é:
- transmitir confiança e autoridade clínica,
- comunicar acolhimento emocional,
- converter visitantes em contatos via WhatsApp,
- possuir excelente experiência mobile,
- carregar rapidamente,
- e permitir expansão futura para SEO e blog.

---

# Arquitetura de Documentação

## IMPORTANTE

Este projeto possui três documentos principais que devem ser tratados como source of truth.

```txt
/docs
  IMPLEMENTATION_PLAN.md
  CONTENT_SOURCE.md
  DESIGN_SYSTEM.md
```

---

# Responsabilidade de Cada Arquivo

## IMPLEMENTATION_PLAN.md

Responsável por:
- arquitetura técnica,
- stack,
- estrutura de componentes,
- regras de implementação,
- roadmap,
- critérios técnicos.

---

## CONTENT_SOURCE.md

Responsável por:
- TODO conteúdo textual do site,
- textos oficiais,
- copy,
- CTAs,
- FAQs,
- mensagens de WhatsApp.

IMPORTANTE:
- não modificar os textos,
- não resumir,
- não adaptar,
- não reescrever sem aprovação explícita.

---

## DESIGN_SYSTEM.md

Responsável por:
- identidade visual,
- cores,
- tipografia,
- layout,
- componentes,
- motion,
- UX,
- responsividade.

---

# Regra Fundamental do Projeto

## IMPORTANTE

Todo conteúdo textual deve vir exclusivamente de:

```txt
CONTENT_SOURCE.md
```

Nunca:
- hardcodear textos nos componentes,
- duplicar conteúdo,
- criar copy alternativa.

---

# Filosofia do Projeto

Este projeto deve priorizar:
- simplicidade,
- clareza,
- performance,
- legibilidade,
- tipografia forte,
- boa experiência mobile,
- alta percepção de profissionalismo.

Evitar:
- overengineering,
- animações excessivas,
- excesso de dependências,
- visual tecnológico,
- aparência de template pronta.

A experiência deve transmitir:
- leveza,
- sofisticação editorial,
- acolhimento,
- segurança emocional,
- rigor técnico.

---

# Stack Técnica

## Framework
- Next.js 15 (App Router)

---

## Linguagem
- TypeScript

---

## Estilização
- Tailwind CSS

---

## Componentes
- shadcn/ui

---

## Ícones
- Lucide React

---

## Deploy
- Vercel

---

## Analytics
- Google Analytics

---

# Estrutura do Projeto

```txt
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
      testimonials.tsx
      faq.tsx
      mission.tsx
      footer.tsx

    ui/
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

---

# Estratégia de Conteúdo

## IMPORTANTE

O conteúdo do arquivo:
```txt
CONTENT_SOURCE.md
```

deve ser transformado em:

```txt
src/content/site-copy.ts
```

---

# Estrutura Recomendada para Conteúdo

Exemplo:

```ts
export const heroContent = {
  title: "...",
  subtitle: "...",
  cta: "...",
}
```

---

# Objetivo dessa Arquitetura

Separar:
- conteúdo,
- apresentação,
- lógica,
- comportamento.

Isso melhora:
- manutenção,
- consistência,
- escalabilidade,
- qualidade do Claude Code,
- SEO futuro,
- possibilidade futura de CMS.

---

# Responsividade

O projeto deve ser mobile-first.

## Prioridades Mobile
- legibilidade,
- boa hierarquia,
- CTAs visíveis,
- espaçamento confortável,
- leitura fluida.

---

# Estratégia Visual

Todo o design deve seguir:
```txt
DESIGN_SYSTEM.md
```

Não alterar:
- tipografia,
- espaçamento,
- comportamento visual,
- hierarquia,
sem instrução explícita.

---

# Estrutura da Landing Page

# 1. Hero Section

## Objetivo
Apresentação inicial da profissional.

## Conteúdo
Consumido do:
```txt
CONTENT_SOURCE.md
```

## Componentes
- heading
- subtitle
- CTA
- italic highlight
- support list
- professional image

## Layout
Desktop:
- texto esquerda
- imagem direita

Mobile:
- empilhado

---

# 2. About Section

## Objetivo
Apresentar:
- trajetória,
- autoridade,
- acolhimento.

## Conteúdo
Consumido do:
```txt
CONTENT_SOURCE.md
```

## CTA
Expandir trajetória:
- inline,
ou
- modal simples.

Não criar página separada inicialmente.

---

# 3. Approach Section

## Objetivo
Explicar abordagem clínica.

## Conteúdo
Consumido do:
```txt
CONTENT_SOURCE.md
```

---

# 4. Services Section

## Componente
Accordion.

## Conteúdo
Consumido do:
```txt
CONTENT_SOURCE.md
```

## Requisitos
- apenas um item aberto,
- excelente experiência mobile,
- animação suave,
- boa leitura.

---

# 5. Testimonials Section

## MVP
Implementação estática inicial:
- nota 5.0,
- estrelas,
- ícone Google.

Sem integração API inicialmente.

---

# 6. FAQ Section

## Componente
Accordion.

## Objetivo
Reduzir objeções.

## Conteúdo
Consumido do:
```txt
CONTENT_SOURCE.md
```

---

# 7. Mission Section

## Objetivo
Fechamento emocional da landing page.

## Conteúdo
Consumido do:
```txt
CONTENT_SOURCE.md
```

---

# 8. Footer

## Conteúdo
Consumido do:
```txt
CONTENT_SOURCE.md
```

---

# WhatsApp

## Estratégia

Todos os CTAs devem abrir:
```txt
https://wa.me/
```

Com mensagens pré-preenchidas.

---

# Floating WhatsApp Button

## Requisitos
- sempre visível,
- discreto,
- alta conversão,
- não sobrepor footer.

---

# SEO

## Estratégia Inicial
SEO local.

## Keywords
- Psicóloga Florianópolis
- Psicóloga Sul da Ilha
- Psicoterapia Online
- Burnout
- Saúde Mental
- Psicóloga Maternidade

---

# Metadata

## Requisitos
- title
- description
- OpenGraph
- favicon
- alt text

---

# Performance

## Objetivos
- Lighthouse acima de 90
- carregamento rápido
- imagens otimizadas
- excelente experiência mobile

---

# Analytics

## Ferramenta
Google Analytics

---

# Eventos mínimos

## whatsapp_click
Disparado em todos os CTAs.

---

## faq_expand
Disparado ao abrir FAQ.

---

## services_expand
Disparado ao abrir serviço.

---

## scroll_75
Disparado ao atingir 75% da página.

---

# Acessibilidade

## Requisitos
- contraste adequado,
- navegação por teclado,
- headings semânticos,
- aria-labels,
- alt text.

---

# Escopo Inicial (MVP)

## Incluído
- landing page única,
- hero,
- serviços,
- FAQ,
- missão,
- footer,
- WhatsApp,
- analytics,
- SEO básico,
- deploy.

---

## Não incluído
- blog,
- CMS,
- backend,
- dashboard,
- dark mode,
- autenticação,
- sistema de agenda,
- formulários complexos.

---

# Arquitetura Futura

A arquitetura deve permitir futuramente:
- blog via MDX,
- CMS,
- páginas individuais,
- SEO expandido,
- conteúdo institucional.

Mas sem implementar isso agora.

---

# Ordem Recomendada de Implementação

# Fase 1 — Foundation

## Tasks
1. Criar projeto Next.js
2. Configurar Tailwind
3. Configurar fontes
4. Configurar shadcn/ui
5. Configurar estrutura base
6. Criar design tokens
7. Configurar metadata
8. Configurar Google Analytics

---

# Fase 2 — Estrutura de Conteúdo

## Tasks
1. Criar:
```txt
src/content/site-copy.ts
```

2. Transformar:
```txt
CONTENT_SOURCE.md
```

em estrutura TypeScript.

3. Garantir:
- nenhuma copy hardcoded,
- conteúdo centralizado,
- reutilização consistente.

---

# Fase 3 — Landing Page

## Tasks
1. Hero
2. About
3. Approach
4. Services
5. Testimonials
6. FAQ
7. Mission
8. Footer
9. Floating WhatsApp Button

---

# Fase 4 — Conversão

## Tasks
1. WhatsApp tracking
2. Analytics events
3. CTA validation
4. Mobile refinements

---

# Fase 5 — Refinamento

## Tasks
1. Performance optimization
2. SEO refinement
3. Accessibility audit
4. Visual polish
5. Lighthouse validation

---

# Critérios de Qualidade

## O site deve:
- parecer profissional,
- transmitir acolhimento,
- carregar rápido,
- funcionar perfeitamente no mobile,
- possuir excelente legibilidade,
- converter facilmente via WhatsApp.

---

# Regras para Claude Code

## IMPORTANTE

Usar:
- IMPLEMENTATION_PLAN.md como source of truth técnica.
- CONTENT_SOURCE.md como source of truth de conteúdo.
- DESIGN_SYSTEM.md como source of truth visual.

---

## Nunca:
- reescrever conteúdo,
- modificar tom editorial,
- hardcodear copy,
- alterar tipografia ou layout sem instrução explícita.

---

# Objetivo Final

A experiência deve parecer:
- humana,
- sofisticada,
- silenciosa,
- acolhedora,
- refinada,
- profissional,
- confiável.

O site não deve parecer:
- tecnológico demais,
- genérico,
- visualmente carregado,
- corporativo excessivo.
