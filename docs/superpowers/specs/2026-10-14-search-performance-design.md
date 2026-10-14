# Search Performance Improvements — Design

**Date:** 2026-10-14
**Branch:** `feat/search-performance`
**Source data:** Google Search Console export "psicoanajulia.com.br-Performance-on-Search-2026-10-14" (Web, last 6 months: 2026-05-17 → 2026-10-11), kept locally in `search-data/` (gitignored).

## 1. Goal

Turn existing search visibility into more visits and WhatsApp contacts, using only changes that trace back to a query or signal in the export. Keep the site's editorial tone; no new copy goes live without Ana Julia's approval.

**Approach:** small targeted changes now, measure again in four weeks. Rejected: a dedicated `/psicologa-campeche` page (the practice has one location, so the home page *is* the local page; a near-duplicate risks doorway treatment and cannibalization) and "measure only" (the Campeche and insurance gaps are already visible and waiting costs clicks).

## 2. Baseline (from the export)

| Metric | Value |
|---|---|
| Clicks / impressions | 23 / 481 |
| CTR / avg. position | 4.8% / 4.8 |
| Pages with traffic | `/` only (23 clicks, 479 impr.) |
| Desktop | 15 clicks, 218 impr., CTR 6.88%, pos. 3.44 |
| Mobile | 8 clicks, 259 impr., CTR 3.09%, pos. 6.03 |
| Monthly impressions | May* 48 · Jun 63 · Jul 111 · Aug 141 · Sep 78 · Oct* 40 (*partial) |

Topic pages were published on 2026-10-13, after the export window, so they have no data yet. Volumes are small; findings are directional.

## 3. Findings → actions

| # | Finding (export evidence) | Action |
|---|---|---|
| F1 | Campeche is the top query cluster: "psicologa campeche" 12 impr., pos. 5.75, 0 clicks; also "psicologo campeche", "psicólogo campeche", "psicologos campeche". Home title/description only say "Florianópolis". | §4.1 home metadata |
| F2 | High positions, zero clicks on local-intent queries: "psicologa florianopolis" pos. 2.25, "psicologa/psicólogo perto de mim" pos. 1. Likely the Google local pack absorbs these clicks. | §4.5 off-site checklist (GBP) |
| F3 | Insurance intent with no answer on the site: "psicólogo florianópolis unimed", "psicologo unimed", "psicóloga pela unimed", "psicólogo unimed florianópolis", "psicólogos unimed florianópolis" (~8 impr.). Ana Julia has no convênio; she works with reimbursement. | §4.2 FAQ |
| F4 | Mobile underperforms: pos. 6.03 vs 3.44, CTR 3.09% vs 6.88%, despite more impressions. | §4.4 mobile audit |
| F5 | Name ambiguity: "medica ana julia", "ana julia servato", "ana julia carvalho neves" (other people); "ana julia psicologa" only pos. 2. Schema `sameAs` holds a share short link for GBP and no Doctoralia. | §4.3 schema |
| F6 | "psicólogo burnout" pos. 1 (1 impr.): topic intent exists. | §4.6 measurement (new topic pages) |
| — | "psicólogo infantil" — out of scope (she sees adolescents, adults, older adults). Masculine "psicólogo" queries — no change; Google matches the variant and she is a psicóloga. UTM GBP URL already canonicalizes to `/`. | none |

## 4. Design

### 4.1 Home metadata (F1)

`src/content/site-content.ts` → `meta.title`, `meta.description`. Proposed drafts for Ana Julia's approval:

- **Title** (current 66 chars, already exempt from the 60-char check): `Psicóloga no Campeche, Florianópolis e Online | Ana Julia Vognach`
- **Description** (≤ 160 chars): `Psicóloga clínica no Campeche, Sul da Ilha de Florianópolis, e online para todo o Brasil e exterior. Burnout, maternidade, luto e psico-oncologia.`

The H1 stays as-is (editorial, approved). The Open Graph title/description follow `meta` as today.

### 4.2 Insurance FAQ and payment wording (F3)

Home FAQ (`faq.items` in `site-content.ts`), inserted right after `pagamento`. The existing FAQPage JSON-LD and `llms.txt` pick it up from the same array; no component change.

- **id:** `plano-de-saude`
- **Question (draft):** `Você atende por plano de saúde, como a Unimed?`
- **Answer (draft):** `O atendimento é particular: não sou credenciada a convênios. Emito nota fiscal de cada sessão para que você possa solicitar reembolso ao seu plano de saúde, como a Unimed e outros, caso ele ofereça essa modalidade. O valor reembolsado depende do seu contrato; vale confirmar diretamente com a operadora.`

Consistency fix: the home `pagamento` answer still says "Entrego recibos", while the client-reviewed topic pages say "emito nota fiscal". Draft for approval: replace `Entrego recibos para que você possa solicitar reembolso` with `Emito nota fiscal para que você possa solicitar reembolso`; rest of the answer unchanged.

### 4.3 Entity signals in schema (F5)

`src/content/site-content.ts` → `brand.location.gbpUrl` (used only by `src/lib/schema.ts`, Person and MedicalBusiness `sameAs`):

- Replace `https://maps.app.goo.gl/yx6VRRiSPBZc5SBH7?g_st=iw` with the canonical `https://www.google.com/maps?cid=12723114800805178726` (resolved from the listing's `ftid` `0x951c610bb5d554cd:0xb09195805a81ed66`).
- Add `brand.location.doctoraliaUrl`: `https://www.doctoralia.com.br/ana-julia-vognach/psicologo/estrela` (the canonical URL the profile redirects to) and include it in both `sameAs` arrays.

If the Doctoralia primary city changes (see §4.5), its canonical URL changes too; update `doctoraliaUrl` then.

### 4.4 Mobile audit (F4)

Run Lighthouse (mobile) against the production build for `/` and `/burnout-saude-mental-trabalho`. Fix only concrete failures: any of Performance / SEO / Accessibility / Best Practices below 90, or an LCP/CLS/INP issue flagged by the report. Record scores in the PR. If everything is ≥ 90, no code change; the gap is attributed to local ranking (F2).

### 4.5 Off-site checklist (F2, F5) — manual, by priority

Added to `docs/MEASUREMENT.md` under "Checklist externo":

1. **Doctoralia:** primary city is **Estrela (RS)** with Florianópolis/Campeche as a second address. If the Estrela office is no longer active, remove it so the profile is filed under Florianópolis; keep name, address and phone identical to the site (NAP).
2. **GBP:** primary category Psicólogo; services listed (psicoterapia individual, casal, familiar, grupo; the four topic areas); weekly or biweekly posts linking to the topic pages with `?utm_source=gbp&utm_medium=organic`; recent photos of the office; ask satisfied patients for reviews within CFP ethics (no incentive, no script).
3. **Bing Webmaster Tools:** verify the site and submit `sitemap.xml`.
4. **Search Console:** request indexing of `/` after this deploy (metadata changed).

### 4.6 Measurement (F6)

- Re-export Search Console on **2026-11-14** with the same filters (Web, compare "last 28 days" with the 6-month baseline above).
- Success signals:
  - the four topic pages appear in Pages with impressions;
  - Campeche queries get CTR > 0;
  - insurance/Unimed queries keep appearing and `/` gets clicks for them;
  - mobile CTR moves toward desktop.
- Also compare PostHog `whatsapp_click` by `channel = organic_search` for the same window.

## 5. Copy approval flow

Same as the topic pages:

1. Drafts from §4.1 and §4.2 go into the DRAFT section of `CONTENT_SOURCE.md` and into `site-content.ts` on this branch.
2. Ana Julia reviews them on the Vercel preview (toolbar comments).
3. Approved or edited text is applied, `CONTENT_SOURCE.md` moves it out of DRAFT, `contentUpdatedAt` is bumped to the approval date.
4. Merge only after approval. Schema and docs changes (§4.3–§4.6) do not need copy approval.

## 6. Testing

- `pnpm build` and `pnpm check:seo` against the local production build: 0 failures. The home title stays under the existing length exemption.
- JSON-LD on `/`: `sameAs` contains the GBP `cid` URL, Instagram and Doctoralia; FAQPage contains `plano-de-saude`. Validate with validator.schema.org and Google Rich Results Test on the preview URL.
- `llms.txt` lists the new FAQ.
- Lighthouse mobile scores recorded in the PR.

## 7. Out of scope

- New pages (local landing pages, blog).
- Changing the H1 or any approved section copy beyond §4.2.
- Paid search, GBP automation, review widgets.
