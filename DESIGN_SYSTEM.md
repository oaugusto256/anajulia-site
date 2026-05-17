# DESIGN_SYSTEM.md

# Design System — Ana Julia Vognach

## Objetivo

Este documento define os padrões visuais, comportamentais e de experiência do usuário da landing page da Ana Julia Vognach.

O objetivo é garantir:
- consistência visual,
- clareza editorial,
- estética acolhedora,
- legibilidade,
- responsividade,
- e alta percepção de profissionalismo.

---

# Direção Criativa

A interface deve transmitir:
- acolhimento,
- leveza,
- sofisticação,
- silêncio visual,
- segurança emocional,
- autoridade clínica.

Evitar:
- aparência corporativa excessiva,
- estética tecnológica,
- exagero visual,
- excesso de animações,
- visual genérico de template.

---

# Referência Estética

A linguagem visual deve se aproximar de:
- editoriais premium,
- clínicas modernas,
- revistas minimalistas,
- interfaces silenciosas e sofisticadas.

---

# Princípios de UI

## 1. Muito espaço em branco

O layout deve respirar.

Evitar:
- blocos densos,
- excesso de informação,
- seções apertadas.

---

## 2. Tipografia como protagonista

A hierarquia tipográfica é mais importante que:
- efeitos visuais,
- animações,
- decoração excessiva.

Priorizar:
- contraste de tamanhos,
- ritmo visual,
- legibilidade,
- boa largura de linha.

---

## 3. Minimalismo funcional

Cada elemento visual deve possuir propósito claro.

---

## 4. Conversão discreta

Os CTAs devem ser claros e visíveis, mas nunca agressivos.

---

# Paleta de Cores

A paleta foi construída para transmitir:
- calma,
- sofisticação,
- naturalidade,
- acolhimento,
- profissionalismo.

O objetivo é evitar:
- contraste agressivo,
- aparência tecnológica,
- estética fria.

---

# 1. Off-white — Fundo Principal

Uso:
- fundo geral do site,
- seções principais,
- base visual da experiência.

Substitui o branco puro para:
- reduzir fadiga visual,
- transmitir sofisticação,
- criar sensação editorial.

```css
#FDFBF7
```

RGB:
```css
rgb(253, 251, 247)
```

---

# 2. Preto Profundo — Títulos e CTAs

Uso:
- headings,
- botões principais,
- textos de destaque,
- elementos de autoridade visual.

```css
#111111
```

RGB:
```css
rgb(17, 17, 17)
```

---

# 3. Verde Oliva — Acentos Sutis

Uso:
- ícones minimalistas,
- detalhes visuais,
- pequenos elementos gráficos,
- hover discreto,
- bullets.

O oliva deve ser utilizado com moderação.

```css
#4A5D4E
```

RGB:
```css
rgb(74, 93, 78)
```

---

# 4. Cinza — Texto Secundário

Uso:
- body text,
- descrições,
- FAQ,
- conteúdo longo.

A prioridade é:
- excelente legibilidade,
- acessibilidade,
- conforto visual.

```css
#555555
```

RGB:
```css
rgb(85, 85, 85)
```

---

# 5. Bordas e Divisores

Uso:
- accordions,
- linhas horizontais,
- divisores,
- bordas suaves.

```css
#E5E5E5
```

RGB:
```css
rgb(229, 229, 229)
```

---

# Tokens Recomendados

## TypeScript

```ts
export const colors = {
  offwhite: '#FDFBF7',
  preto: '#111111',
  oliva: '#4A5D4E',
  cinza: '#555555',
  linhas: '#E5E5E5',
}
```

---

# Tipografia

# Heading Font

## Playfair Display

Características:
- editorial,
- elegante,
- sofisticada,
- humana,
- densa.

---

# Body Font

## Inter

Características:
- moderna,
- limpa,
- extremamente legível,
- silenciosa.

---

# Hierarquia Tipográfica

## Hero Title

```css
font-size: clamp(2.75rem, 5vw, 5rem);
font-weight: 600;
line-height: 1.02;
letter-spacing: -0.04em;
```

---

## Section Titles

```css
font-size: clamp(2rem, 4vw, 3rem);
font-weight: 600;
line-height: 1.1;
```

---

## Body Text

```css
font-size: 1rem;
line-height: 1.9;
```

---

## Small Text

```css
font-size: 0.875rem;
line-height: 1.7;
```

---

# Layout

# Container

## Max Width

```css
max-width: 1200px;
```

---

## Horizontal Padding

Desktop:

```css
padding-inline: 32px;
```

Mobile:

```css
padding-inline: 20px;
```

---

# Espaçamento Vertical

## Desktop

```css
padding-block: 120px;
```

---

## Mobile

```css
padding-block: 80px;
```

---

# Grid

# Hero Desktop

```txt
2 colunas
```

---

# Hero Mobile

```txt
1 coluna
```

---

# Componentes

# Primary Button

Características:
- fundo preto,
- texto off-white,
- bordas discretas,
- hover elegante,
- sem gradientes.

---

## CSS Reference

```css
background: #111111;
color: #FDFBF7;
border-radius: 10px;
padding: 14px 24px;
transition: all 0.2s ease;
```

---

# Hover

```css
opacity: 0.94;
transform: translateY(-1px);
```

---

# Accordion

Utilizado em:
- Serviços,
- FAQ.

---

## Comportamento

- apenas um item aberto,
- animação suave,
- excelente leitura mobile.

---

## Visual

- bordas sutis,
- fundo transparente,
- muito espaço interno,
- sem sombras pesadas.

---

# Cards

Evitar aparência de dashboard.

Os blocos devem parecer:
- editoriais,
- leves,
- sofisticados,
- silenciosos.

---

# WhatsApp Floating Button

## Objetivo

Alta conversão sem agressividade visual.

---

## Posicionamento

```css
position: fixed;
bottom: 24px;
right: 24px;
```

---

## Visual

- discreto,
- sombra suave,
- sem animações exageradas.

---

# Imagens

# Foto Principal

## Estilo

- profissional,
- natural,
- iluminação suave,
- acolhedora,
- editorial.

Evitar:
- aparência corporativa,
- excesso de edição,
- poses artificiais.

---

# Ícones

## Biblioteca

Lucide React.

---

## Estilo

- minimalista,
- outline,
- leve,
- discreto.

Preferencialmente:
- utilizando oliva como cor secundária.

---

# Motion & Interações

# Filosofia

Animações devem:
- apoiar leitura,
- transmitir fluidez,
- nunca dominar atenção.

---

# Permitido

- fade-in suave,
- accordion animations,
- microtransições,
- hover states discretos.

---

# Evitar

- parallax,
- transforms exagerados,
- animações chamativas,
- motion excessivo.

---

# Responsividade

# Mobile First

A experiência mobile é prioridade absoluta.

Provavelmente:
- 80%+ do tráfego será mobile.

---

# Requisitos Mobile

## Legibilidade

Textos devem respirar.

---

## Botões

CTAs grandes o suficiente para toque.

---

## Hero

Imagem abaixo do texto.

---

## Espaçamento

Nunca comprimir conteúdo.

---

# SEO Visual

O site deve parecer:
- rápido,
- sofisticado,
- confiável,
- silencioso.

Mesmo antes da interação.

---

# Acessibilidade

# Contraste

Garantir contraste AA.

---

# Navegação

- teclado funcional,
- headings semânticos,
- aria-labels.

---

# Imagens

Todas devem possuir alt text.

---

# Performance

# Prioridades

## Imagens

- utilizar next/image,
- lazy loading,
- tamanhos responsivos.

---

## Fontes

- utilizar next/font,
- preload automático.

---

## JavaScript

Evitar:
- bibliotecas pesadas,
- dependências desnecessárias,
- client components sem necessidade.

---

# Regras para Claude Code

## IMPORTANTE

Não modificar:
- paleta,
- tipografia,
- espaçamentos,
- hierarquia visual,
- tom editorial,
sem instrução explícita.

---

# Conteúdo

Todo texto deve vir exclusivamente de:

```txt
CONTENT_SOURCE.md
```

Nunca hardcodear conteúdo textual nos componentes.

---

# Objetivo Final

A experiência deve parecer:
- humana,
- refinada,
- acolhedora,
- silenciosa,
- sofisticada,
- emocionalmente segura,
- profissional.

O site NÃO deve parecer:
- tecnológico demais,
- genérico,
- frio,
- visualmente carregado.
