# Search Performance Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Search Console–driven changes: Campeche in home metadata, an insurance/Unimed FAQ, canonical GBP + Doctoralia in schema `sameAs`, a mobile Lighthouse audit, and the off-site/measurement docs.

**Architecture:** All copy lives in `src/content/site-content.ts`; JSON-LD (`src/lib/schema.ts`), `llms.txt` (`src/lib/llms.ts`) and the FAQ section read from it, so content changes need no component edits. Each change is pinned by a new assertion in `scripts/check-seo.mjs` (the project's only test harness: it runs against a local production build). New copy ships as a draft for Ana Julia's review on the Vercel preview; the final task applies her approval.

**Tech Stack:** Next.js 15 App Router, TypeScript, Node 24 (runs `.ts` directly), pnpm, Lighthouse CLI (via `npx`), `gh`.

**Spec:** `docs/superpowers/specs/2026-10-14-search-performance-design.md`

## Global Constraints

- Never hardcode copy in components; all text comes from `src/content/site-content.ts` (CLAUDE.md rule 1).
- New copy is a draft until Ana Julia approves it on the Vercel preview; do not merge before approval (spec §5).
- Home title draft: `Psicóloga no Campeche, Florianópolis e Online | Ana Julia Vognach`.
- Home description draft: `Psicóloga clínica no Campeche, Sul da Ilha de Florianópolis, e online para todo o Brasil e exterior. Burnout, maternidade, luto e psico-oncologia.` (≤ 160 chars).
- FAQ id `plano-de-saude`, inserted right after `pagamento`.
- GBP canonical URL: `https://www.google.com/maps?cid=12723114800805178726`.
- Doctoralia URL: `https://www.doctoralia.com.br/ana-julia-vognach/psicologo/estrela`.
- Re-measurement date: 2026-11-14.
- `search-data/` stays gitignored; never commit the raw export.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Description over 160 chars after Ana Julia edits it** → `check:seo` already fails on > 160; Task 6 re-runs it after applying her text.
2. **Home title grows past the 66 chars already accepted** → the exemption only warns; Task 3 adds a hard cap of 70 chars for `/` so an edited title can't silently grow.
3. **`sameAs` regressions** (short share link sneaking back, duplicates, Doctoralia missing on one of the two nodes) → Task 1 checks both Person and MedicalBusiness nodes, rejects `maps.app.goo.gl` / `share.google`, and rejects duplicates.
4. **New FAQ present on the page but missing from FAQPage JSON-LD or `llms.txt`** → Task 2 asserts all three surfaces.
5. **Doctoralia moves its primary city to Florianópolis** (Ana Julia is checking) → URL changes; single source of truth in `brand.location.doctoraliaUrl`, and Task 6 has a step to update it before merge.

---

### Task 0: Rebase on main after PR #17

**Files:** none (git only)

- [ ] **Step 1: Confirm PR #17 is merged**

Run: `gh pr view 17 --json state -q .state`
Expected: `MERGED`. If `OPEN`, stop and ask the user to merge it first (it moves the topic pages out of DRAFT in `CONTENT_SOURCE.md` and sets `contentUpdatedAt` to `2026-10-13`; later tasks build on both).

- [ ] **Step 2: Rebase**

```bash
git checkout feat/search-performance
git fetch origin
git rebase origin/main
```

Expected: clean rebase (this branch only adds `.gitignore` line and the spec/plan docs).

- [ ] **Step 3: Verify**

Run: `grep -n "contentUpdatedAt =" src/content/site-content.ts && grep -n "^# DRAFT\|^# PÁGINAS DE TEMA" CONTENT_SOURCE.md`
Expected: `contentUpdatedAt = "2026-10-13"`, no `# DRAFT` heading, one `# PÁGINAS DE TEMA E TEXTOS COMPLEMENTARES` heading.

---

### Task 1: Canonical GBP + Doctoralia in schema `sameAs`

**Files:**
- Modify: `scripts/check-seo.mjs` (JSON-LD helpers, ~line 104; new home check)
- Modify: `src/content/site-content.ts` (`brand.location.gbpUrl`, new `doctoraliaUrl`)
- Modify: `src/lib/schema.ts:51` and `src/lib/schema.ts:109`

**Interfaces:**
- Produces: `brand.location.doctoraliaUrl: string`; `ldNodes(path, html): object[]` helper in `check-seo.mjs` (used by Task 2).

- [ ] **Step 1: Add `ldNodes` helper and make `ldTypes` use it**

In `scripts/check-seo.mjs`, replace the existing `ldTypes` function with:

```js
// ── JSON-LD ──
function ldNodes(path, html) {
  const nodes = []
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    let data
    try {
      data = JSON.parse(m[1])
    } catch (e) {
      fail(path, `JSON-LD does not parse: ${e.message}`)
      continue
    }
    nodes.push(...(data["@graph"] ?? [data]))
  }
  return nodes
}

function ldTypes(path, html) {
  const types = new Set()
  for (const node of ldNodes(path, html)) {
    for (const t of [node["@type"]].flat()) if (t) types.add(t)
  }
  return types
}
```

- [ ] **Step 2: Write the failing `sameAs` check**

Add after the `EXPECTED_TYPES` page check:

```js
// ── home: entity links (sameAs) ──
const SAME_AS_REQUIRED = [brand.location.gbpUrl, brand.location.doctoraliaUrl, brand.contact.instagram.href]
pageChecks.push((path, html, kind) => {
  if (kind !== "home") return
  for (const type of ["Person", "MedicalBusiness"]) {
    const node = ldNodes(path, html).find((n) => [n["@type"]].flat().includes(type))
    const sameAs = node?.sameAs ?? []
    for (const url of SAME_AS_REQUIRED) {
      if (!url) fail(path, `${type}.sameAs: required URL is undefined in site-content`)
      else if (!sameAs.includes(url)) fail(path, `${type}.sameAs missing ${url}`)
    }
    if (new Set(sameAs).size !== sameAs.length) fail(path, `${type}.sameAs has duplicates`)
    for (const url of sameAs) {
      if (/maps\.app\.goo\.gl|share\.google/.test(url)) fail(path, `${type}.sameAs uses a share short link: ${url}`)
    }
  }
})
```

- [ ] **Step 3: Run it and see it fail**

```bash
pnpm build && (pnpm start -p 3077 >/dev/null 2>&1 &) && sleep 5
BASE_URL=http://localhost:3077 pnpm check:seo; pkill -f "next start -p 3077"
```

Expected: FAIL with `Person.sameAs: required URL is undefined in site-content` and `uses a share short link: https://maps.app.goo.gl/...` (same for MedicalBusiness).

- [ ] **Step 4: Update content**

In `src/content/site-content.ts`, inside `brand.location`, replace the `gbpUrl` line with:

```ts
    /** URL canônica do Google Business Profile (cid), não o link curto de compartilhamento. */
    gbpUrl: "https://www.google.com/maps?cid=12723114800805178726",
    /** Perfil no Doctoralia (URL final após redirecionamento). Atualizar se a cidade principal do perfil mudar. */
    doctoraliaUrl: "https://www.doctoralia.com.br/ana-julia-vognach/psicologo/estrela",
```

- [ ] **Step 5: Update schema**

`src/lib/schema.ts:51`:

```ts
    sameAs: [brand.contact.instagram.href, loc.gbpUrl, loc.doctoraliaUrl],
```

`src/lib/schema.ts:109`:

```ts
    sameAs: [loc.gbpUrl, loc.doctoraliaUrl, brand.contact.instagram.href],
```

- [ ] **Step 6: Run check and see it pass**

Same commands as Step 3. Expected: `0 failure(s), 1 warning(s)` (the known home title length warning).

- [ ] **Step 7: Commit**

```bash
git add scripts/check-seo.mjs src/content/site-content.ts src/lib/schema.ts
git commit -m "feat(seo): canonical GBP and Doctoralia in schema sameAs

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Insurance FAQ and payment wording (draft copy)

**Files:**
- Modify: `scripts/check-seo.mjs` (new home FAQ check; update h3 comment)
- Modify: `src/content/site-content.ts` (`faq.items`: new item after `pagamento`; `pagamento` answer)
- Modify: `CONTENT_SOURCE.md` (new DRAFT section at the end)

**Interfaces:**
- Consumes: `ldNodes(path, html)` from Task 1.
- Produces: `faq.items` entry with `id: "plano-de-saude"`; `# DRAFT — revisão Ana Julia (busca, 2026-10-14)` section in `CONTENT_SOURCE.md` (Task 3 appends to it, Task 6 dissolves it).

- [ ] **Step 1: Write the failing check**

In `scripts/check-seo.mjs`, add `faq` to the import on line 5:

```js
import { brand, contentUpdatedAt, faq, topicPages } from "../src/content/site-content.ts"
```

Add after the `sameAs` check:

```js
// ── home: insurance FAQ (Search Console: "psicólogo unimed" queries) ──
const INSURANCE_FAQ_ID = "plano-de-saude"
pageChecks.push((path, html, kind) => {
  if (kind !== "home") return
  const item = faq.items.find((i) => i.id === INSURANCE_FAQ_ID)
  if (!item) return fail(path, `faq.items has no "${INSURANCE_FAQ_ID}"`)
  const ids = faq.items.map((i) => i.id)
  if (ids.indexOf(INSURANCE_FAQ_ID) !== ids.indexOf("pagamento") + 1) fail(path, `"${INSURANCE_FAQ_ID}" must come right after "pagamento"`)
  if (!decode(html).includes(item.question)) fail(path, "insurance FAQ question not rendered")
  const faqPage = ldNodes(path, html).find((n) => n["@type"] === "FAQPage")
  const questions = (faqPage?.mainEntity ?? []).map((q) => q.name)
  if (!questions.includes(item.question)) fail(path, "insurance FAQ missing from FAQPage JSON-LD")
  if (/Entrego recibos/.test(faq.items.find((i) => i.id === "pagamento")?.answer ?? "")) fail(path, 'pagamento answer still says "Entrego recibos" (topic pages use nota fiscal)')
})
siteChecks.push(async () => {
  const item = faq.items.find((i) => i.id === INSURANCE_FAQ_ID)
  if (!item) return
  const llms = await get("/llms.txt")
  if (!llms.body.includes(`### ${item.question}`)) fail("/llms.txt", "insurance FAQ missing")
})
```

Update the heading-outline comment (no threshold change; `≥ 14` still holds):

```js
// h3: 4 services + 4 áreas + 7 FAQ questions.
```

- [ ] **Step 2: Run it and see it fail**

Same build/start/check commands as Task 1 Step 3.
Expected: FAIL with `faq.items has no "plano-de-saude"`.

- [ ] **Step 3: Add the FAQ item and fix `pagamento`**

In `src/content/site-content.ts`, `faq.items`, replace the `pagamento` item and insert the new one right after it:

```ts
    {
      id: "pagamento",
      question: "Como é feito o pagamento?",
      answer:
        "O pagamento é realizado via PIX ou transferência bancária. Trabalho com modalidades por sessão ou pacotes, combinados em nossa primeira conversa. Emito nota fiscal para que você possa solicitar reembolso no seu plano de saúde, caso ele ofereça essa modalidade.",
    },
    {
      id: "plano-de-saude",
      question: "Você atende por plano de saúde, como a Unimed?",
      answer:
        "O atendimento é particular: não sou credenciada a convênios. Emito nota fiscal de cada sessão para que você possa solicitar reembolso ao seu plano de saúde, como a Unimed e outros, caso ele ofereça essa modalidade. O valor reembolsado depende do seu contrato; vale confirmar diretamente com a operadora.",
    },
```

- [ ] **Step 4: Record the draft in `CONTENT_SOURCE.md`**

Append at the end of the file:

```markdown

---

# DRAFT — revisão Ana Julia (busca, 2026-10-14)

> Textos redigidos por Claude a partir dos dados do Google Search Console (spec `docs/superpowers/specs/2026-10-14-search-performance-design.md`). Já aplicados em `src/content/site-content.ts` neste branch para revisão no preview da Vercel; o merge só acontece após a aprovação.

## FAQ (home) — nova pergunta, após "Como é feito o pagamento?"

_id: plano-de-saude_

#### QUESTION
Você atende por plano de saúde, como a Unimed?

#### ANSWER
O atendimento é particular: não sou credenciada a convênios. Emito nota fiscal de cada sessão para que você possa solicitar reembolso ao seu plano de saúde, como a Unimed e outros, caso ele ofereça essa modalidade. O valor reembolsado depende do seu contrato; vale confirmar diretamente com a operadora.

## FAQ (home) — ajuste em "Como é feito o pagamento?"

Trocar "Entrego recibos para que você possa solicitar reembolso" por "Emito nota fiscal para que você possa solicitar reembolso", alinhando com as páginas de tema. Restante da resposta sem alteração.
```

- [ ] **Step 5: Run check and see it pass**

Same commands. Expected: `0 failure(s), 1 warning(s)`.

- [ ] **Step 6: Commit**

```bash
git add scripts/check-seo.mjs src/content/site-content.ts CONTENT_SOURCE.md
git commit -m "feat(content): draft insurance FAQ and nota fiscal wording on home

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Home title and description with Campeche (draft copy)

**Files:**
- Modify: `scripts/check-seo.mjs` (new home metadata check)
- Modify: `src/content/site-content.ts:55-57` (`meta.title`, `meta.description`)
- Modify: `CONTENT_SOURCE.md` (append to the DRAFT section from Task 2)

**Interfaces:**
- Consumes: DRAFT section heading from Task 2.

- [ ] **Step 1: Write the failing check**

In `scripts/check-seo.mjs`, add after the insurance FAQ checks:

```js
// ── home: local intent in metadata (Search Console: "psicologa campeche" is the top query) ──
const HOME_TITLE_HARD_MAX = 70
pageChecks.push((path, html, kind) => {
  if (kind !== "home") return
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "")
  const description = attr(findTag(html, /<meta[^>]+name="description"[^>]*>/), "content") ?? ""
  if (!title.includes("Campeche")) fail(path, "home <title> should mention Campeche")
  if (title.length > HOME_TITLE_HARD_MAX) fail(path, `home title is ${title.length} chars (> ${HOME_TITLE_HARD_MAX})`)
  for (const term of ["Campeche", "Sul da Ilha", "Burnout"]) {
    if (!description.includes(term)) fail(path, `home meta description should mention ${term}`)
  }
})
```

- [ ] **Step 2: Run it and see it fail**

Same commands. Expected: FAIL with `home <title> should mention Campeche` and three description failures.

- [ ] **Step 3: Update `meta`**

In `src/content/site-content.ts`:

```ts
  title: "Psicóloga no Campeche, Florianópolis e Online | Ana Julia Vognach",
  description:
    "Psicóloga clínica no Campeche, Sul da Ilha de Florianópolis, e online para todo o Brasil e exterior. Burnout, maternidade, luto e psico-oncologia.",
```

- [ ] **Step 4: Append to the DRAFT section in `CONTENT_SOURCE.md`**

```markdown

## SEO da home (`meta.title`, `meta.description`)

Atual:
- Título: Psicóloga Online e Presencial em Florianópolis | Ana Julia Vognach
- Descrição: Psicoterapia online para o Brasil e exterior, e presencial em Florianópolis. Apoio especializado em transições de vida, saúde mental, luto e maternidade.

Proposta (Campeche é a busca mais frequente; "burnout" não aparecia):
- Título: Psicóloga no Campeche, Florianópolis e Online | Ana Julia Vognach
- Descrição: Psicóloga clínica no Campeche, Sul da Ilha de Florianópolis, e online para todo o Brasil e exterior. Burnout, maternidade, luto e psico-oncologia.
```

- [ ] **Step 5: Run check and see it pass**

Same commands. Expected: `0 failure(s), 1 warning(s)` (title is 65 chars: warning, under the 70 hard max).

- [ ] **Step 6: Commit**

```bash
git add scripts/check-seo.mjs src/content/site-content.ts CONTENT_SOURCE.md
git commit -m "feat(seo): draft home title and description with Campeche

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Mobile Lighthouse audit

**Files:**
- Create (scratch, not committed): Lighthouse JSON reports in the session scratchpad
- Modify: only files a concrete failure points to (unknown until the audit runs)

- [ ] **Step 1: Run Lighthouse (mobile is the default form factor)**

```bash
pnpm build && (pnpm start -p 3077 >/dev/null 2>&1 &) && sleep 5
OUT=<scratchpad>/lighthouse; mkdir -p $OUT
for p in "" "burnout-saude-mental-trabalho"; do
  npx -y lighthouse@12.6.0 "http://localhost:3077/$p" --quiet --chrome-flags="--headless=new" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json --output-path="$OUT/${p:-home}.json"
done
pkill -f "next start -p 3077"
for f in $OUT/*.json; do node -e 'const r=require(process.argv[1]);console.log(process.argv[1].split("/").pop(),Object.values(r.categories).map(c=>c.id+"="+Math.round(c.score*100)).join(" "),"LCP="+r.audits["largest-contentful-paint"].displayValue,"CLS="+r.audits["cumulative-layout-shift"].displayValue,"TBT="+r.audits["total-blocking-time"].displayValue)' "$f"; done
```

Expected: one line per page with four scores and LCP/CLS/TBT.

- [ ] **Step 2: Decide**

If every score is ≥ 90 and no LCP/CLS/TBT audit is red: no code change; record the line output for the PR description and go to Task 5.
If a score is < 90: list the failing audits with
`node -e 'const r=require(process.argv[1]);for(const a of Object.values(r.audits))if(a.score!==null&&a.score<0.9&&a.details)console.log(a.id,"-",a.title)' <report>.json`,
fix only those (each fix its own commit, message `fix(perf): <audit id>` or `fix(a11y): <audit id>`), and re-run Step 1 until all are ≥ 90. If a fix needs a design or copy change, stop and ask the user.

---

### Task 5: Off-site checklist and re-measurement in `docs/MEASUREMENT.md`

**Files:**
- Modify: `docs/MEASUREMENT.md` (sections "Checklist externo" and a new "Search Console")

- [ ] **Step 1: Replace the "Checklist externo" section**

Replace everything from `## Checklist externo (manual, a qualquer momento)` to the end of the file with:

```markdown
## Checklist externo (manual, por prioridade)
Origem: export do Search Console de 2026-10-14 (spec `docs/superpowers/specs/2026-10-14-search-performance-design.md`).

1. Doctoralia: a cidade principal do perfil está como Estrela (RS), com Florianópolis/Campeche como segundo endereço. Se o consultório de Estrela não estiver mais ativo, removê-lo para o perfil ficar em Florianópolis; nome, endereço e telefone idênticos ao site (NAP). Se a URL do perfil mudar, atualizar `brand.location.doctoraliaUrl`.
2. Google Business Profile: categoria principal Psicólogo; serviços (psicoterapia individual, casal, familiar, grupo e as quatro áreas); posts quinzenais com link para as páginas de tema usando `?utm_source=gbp&utm_medium=organic`; fotos recentes do consultório; link do site `https://psicoanajulia.com.br/?utm_source=gbp&utm_medium=organic`.
3. Pedir avaliações no Google a pacientes satisfeitos, dentro da ética do CFP (sem incentivo, sem roteiro).
4. Bio do Instagram: `https://psicoanajulia.com.br/?utm_source=instagram&utm_medium=social`.
5. Google Search Console: enviar `sitemap.xml`; solicitar indexação de cada página nova e da home após mudanças de título/descrição.
6. Bing Webmaster Tools: verificar o site e enviar `sitemap.xml` (alimenta ChatGPT search e Copilot).

## Search Console — revisão periódica
- Próxima revisão: **2026-11-14**. Exportar Desempenho (Web) dos últimos 28 dias e comparar com a linha de base da spec de 2026-10-14 (23 cliques, 481 impressões, CTR 4,8%, posição 4,8; celular CTR 3,09% vs computador 6,88%).
- Sinais de sucesso: as quatro páginas de tema aparecem em Páginas; consultas com "campeche" têm CTR > 0; consultas com "unimed" continuam aparecendo e a home recebe cliques; CTR no celular se aproxima do computador.
- Cruzar com PostHog: `whatsapp_click` com `channel = organic_search` no mesmo período.
- Guardar o export fora do git (pasta `search-data/`, já no `.gitignore`).
```

- [ ] **Step 2: Verify nothing else in the file was lost**

Run: `git diff --stat docs/MEASUREMENT.md && grep -c "^## " docs/MEASUREMENT.md`
Expected: only that file changed; section count = previous count + 1.

- [ ] **Step 3: Commit**

```bash
git add docs/MEASUREMENT.md
git commit -m "docs(measurement): prioritized off-site checklist and Search Console review

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Preview, client approval, finalize

**Files:**
- Modify: `src/content/site-content.ts` (approved copy, `contentUpdatedAt`, maybe `doctoraliaUrl`)
- Modify: `CONTENT_SOURCE.md` (dissolve the DRAFT section into the official sections)

- [ ] **Step 1: Push and open the PR**

```bash
git push -u origin feat/search-performance
gh pr create --base main --title "feat(seo): search performance improvements" --body "<summary of Tasks 1–5, Lighthouse scores from Task 4, and: Draft copy (home title/description, insurance FAQ, pagamento wording) awaits Ana Julia's review on the preview. Do not merge before approval.>

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

- [ ] **Step 2: Validate the preview**

From `gh pr checks` / Vercel, take the preview URL. Run Google Rich Results Test and validator.schema.org on `<preview>/`: no errors; FAQPage shows the new question; Person and MedicalBusiness show three `sameAs` URLs. Run `BASE_URL=<preview> pnpm check:seo`: expect `0 failure(s)` (the preview may add Vercel protection; if it returns 401, skip this run and rely on the local run).

- [ ] **Step 3: Wait for approval**

Stop. Ask the user to share the preview with Ana Julia. Read her feedback with `vercel comments` (see memory note on Vercel review comments). Also ask whether the Doctoralia city changed; if yes, resolve the new URL with `curl -s -o /dev/null -L -w '%{url_effective}' https://www.doctoralia.com.br/ana-julia-vognach` and update `brand.location.doctoraliaUrl`.

- [ ] **Step 4: Apply approved copy**

Apply her exact text (or keep drafts if approved as-is) in `src/content/site-content.ts`. Set `contentUpdatedAt` to the approval date (`YYYY-MM-DD`).

- [ ] **Step 5: Move copy out of DRAFT in `CONTENT_SOURCE.md`**

- In `# FAQ_SECTION` → `## FAQS`: update `FAQ_3` answer ("Emito nota fiscal…"), insert the insurance FAQ as `FAQ_4` (same `#### QUESTION` / `#### ANSWER` format), renumber the following entries `FAQ_5`–`FAQ_7`.
- Add a `# SEO_HOME` section right before `# FAQ_SECTION`, with `## TITLE` and `## DESCRIPTION` holding the approved text.
- Delete the `# DRAFT — revisão Ana Julia (busca, 2026-10-14)` section.

- [ ] **Step 6: Re-run the checks**

Same build/start/check commands as Task 1 Step 3. Expected: `0 failure(s)`. If her edited description exceeds 160 chars or her title exceeds 70, ask her for a shorter version; don't trim her copy yourself.

- [ ] **Step 7: Commit, push, hand off**

```bash
git add src/content/site-content.ts CONTENT_SOURCE.md
git commit -m "feat(content): apply client approval for search copy

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

Tell the user it is ready to merge, and list post-deploy steps: Search Console → request indexing of `/`; Rich Results Test on production `/`.
