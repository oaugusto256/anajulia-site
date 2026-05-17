# CLAUDE.md

# Claude Code Instructions — Ana Julia Vognach Website

## Context

You are working on a professional landing page for:
- Ana Julia Vognach
- Clinical Psychologist
- Focused on:
  - burnout,
  - motherhood,
  - grief,
  - mental health at work,
  - adult psychotherapy.

The website should feel:
- human,
- sophisticated,
- welcoming,
- editorial,
- emotionally safe,
- minimalistic,
- professional.

Avoid:
- generic SaaS aesthetics,
- overly corporate visuals,
- excessive animations,
- visually noisy interfaces.

---

# Source of Truth Files

## IMPORTANT

This project is driven by 3 main documents:

```txt
/docs
  IMPLEMENTATION_PLAN.md
  CONTENT_SOURCE.md
  DESIGN_SYSTEM.md
```

You MUST follow all three.

---

# Responsibility of Each File

## IMPLEMENTATION_PLAN.md

Defines:
- architecture,
- technical decisions,
- project structure,
- implementation rules,
- roadmap,
- quality requirements.

---

## CONTENT_SOURCE.md

Defines:
- ALL textual content,
- official copy,
- CTAs,
- FAQ content,
- WhatsApp messages.

IMPORTANT:
- NEVER rewrite content unless explicitly requested.
- NEVER summarize content.
- NEVER invent alternative copy.

---

## DESIGN_SYSTEM.md

Defines:
- typography,
- spacing,
- visual hierarchy,
- colors,
- UX behavior,
- motion philosophy,
- component aesthetics.

---

# Critical Project Rules

# 1. Never Hardcode Copy

All textual content MUST come from:

```txt
src/content/site-copy.ts
```

Never:
- hardcode strings in components,
- duplicate copy,
- create inline text content.

Bad:

```tsx
<h1>Psychologist</h1>
```

Good:

```tsx
import { heroContent } from "@/content/site-copy"
```

---

# 2. Preserve Editorial Tone

The tone of the project is:
- emotionally intelligent,
- calm,
- sophisticated,
- professional,
- warm,
- subtle.

Avoid:
- marketing-heavy language,
- startup/SaaS tone,
- aggressive CTAs,
- corporate phrasing.

---

# 3. Prioritize Typography

Typography is more important than:
- effects,
- animations,
- decorative UI.

The experience should feel:
- breathable,
- elegant,
- editorial.

---

# 4. Mobile First

Most traffic will likely be mobile.

Prioritize:
- readability,
- spacing,
- tap targets,
- fast loading,
- scroll rhythm.

---

# 5. Simplicity Over Complexity

Prefer:
- simple architecture,
- small components,
- low dependency count,
- predictable structure.

Avoid:
- overengineering,
- unnecessary abstractions,
- excessive state management,
- premature optimization.

---

# Stack

## Framework
- Next.js 15 App Router

## Language
- TypeScript

## Styling
- Tailwind CSS

## Components
- shadcn/ui

## Icons
- Lucide React

## Deploy
- Vercel

## Analytics
- Google Analytics

---

# Project Structure

```txt
src/
  app/
  components/
  content/
  lib/
```

---

# Component Philosophy

Components should:
- be small,
- reusable,
- semantic,
- predictable,
- accessible.

Avoid:
- massive files,
- deeply nested JSX,
- excessive props drilling.

---

# Content Architecture

## IMPORTANT

Transform:
```txt
CONTENT_SOURCE.md
```

into:
```txt
src/content/site-copy.ts
```

The TypeScript content file should:
- centralize content,
- expose typed objects,
- organize content by section.

Example:

```ts
export const heroContent = {
  title: "",
  subtitle: "",
  cta: "",
}
```

---

# Accessibility

All components must:
- support keyboard navigation,
- use semantic HTML,
- include aria-labels when needed,
- maintain accessible contrast,
- include alt text for images.

---

# SEO

Initial focus:
- local SEO,
- Florianópolis,
- Sul da Ilha,
- burnout,
- psychotherapy,
- motherhood.

---

# Performance

Performance is a priority.

Goals:
- Lighthouse score above 90,
- fast mobile loading,
- optimized images,
- minimal JS.

Use:
- next/image
- next/font

Avoid:
- large animation libraries,
- unnecessary client components.

---

# Animation Philosophy

Motion should:
- support UX,
- feel subtle,
- never dominate attention.

Allowed:
- fade-ins,
- accordion animations,
- subtle hover states.

Avoid:
- parallax,
- large transforms,
- distracting transitions.

---

# WhatsApp CTA Strategy

The primary conversion flow is:
- direct WhatsApp contact.

All CTAs should:
- feel natural,
- be highly visible,
- but never aggressive.

---

# Analytics Events

Minimum events:

```txt
whatsapp_click
faq_expand
services_expand
scroll_75
```

---

# Future Architecture

The architecture should support future:
- MDX blog,
- CMS integration,
- additional pages,
- expanded SEO.

But DO NOT implement these now.

---

# Design Expectations

The final website should feel:
- editorial,
- premium,
- minimal,
- calm,
- emotionally safe,
- highly readable.

It should NOT feel:
- like a SaaS,
- template-based,
- overly modern/techy,
- visually loud.

---

# When Making Decisions

Prefer:
1. clarity
2. readability
3. simplicity
4. consistency
5. performance

over:
- cleverness,
- abstraction,
- visual complexity.

---

# Final Goal

Create a landing page that:
- builds trust,
- communicates emotional safety,
- feels sophisticated,
- converts naturally,
- and represents a high-end clinical experience.
