# Medição, publicação e checklist externo

## Eventos (PostHog, projeto EU)
| Evento | Propriedades |
|---|---|
| `$pageview` | automático; super-propriedades `channel`, `landing_page` |
| `whatsapp_click` | `location`, `page_path`, `topic` (páginas de tema) |
| `faq_expand` | `id`, `page_path`, `topic` |
| `services_expand` | `id`, `page_path` |
| `scroll_75` | `page_path`, `topic` |

`channel`: valor de `utm_source` (minúsculo) ou `organic_search`, `ai_chatgpt`, `ai_perplexity`, `ai_gemini`, `ai_claude`, `ai_copilot`, `instagram`, `facebook`, `referral`, `internal`, `direct`.

## Dashboard (configurar uma vez no PostHog)
1. Funil: `$pageview` → `scroll_75` → `whatsapp_click`, breakdown por `channel`, janela de conversão 1 dia.
2. Tendência: `whatsapp_click` (total), breakdown por `landing_page`; segunda série com breakdown por `topic`.
3. Tendência: `$pageview` com filtro `channel` começando com `ai_`, breakdown por `channel`.

## Registro de contatos → pacientes (Google Sheet)
Colunas: `data do contato` · `origem` (mensagem do WhatsApp — ex.: "Vi sua página sobre luto…" — ou resposta a "como me encontrou?") · `virou paciente (s/n)` · `data da 1ª sessão`.
Revisão mensal: comparar contagem de linhas por origem com `whatsapp_click` por `channel`/`topic` no mesmo mês.

## Publicar uma página de tema (após aprovação de Ana Julia)
1. Em `src/content/site-content.ts`: `status: "published"`, `reviewedAt` = data da aprovação, `contentUpdatedAt` = hoje.
2. Atualizar `CONTENT_SOURCE.md` (mover o texto para fora da seção DRAFT).
3. `pnpm build && pnpm start` + `pnpm check:seo` sem falhas.
4. Após o deploy: Google Search Console → Inspeção de URL → solicitar indexação; Rich Results Test na URL.

## Migração GA → PostHog
- Fase A (atual): PostHog e GA4 em paralelo por 2–4 semanas. Comparar pageviews e `whatsapp_click` semanais; diferença esperada < 15% (GA usa cookies, PostHog não).
- Fase B: remover GA e Vercel Analytics (plano, Task 12).

## Verificação manual após cada deploy relevante
- Google Rich Results Test: home e uma página de tema publicada → sem erros.
- validator.schema.org: home → sem erros.
- Lighthouse mobile (home e uma página de tema): Performance, SEO, Acessibilidade ≥ 90.
- PostHog → Activity: eventos chegando com `channel`.

## Checklist externo (manual, a qualquer momento)
1. Google Business Profile: categoria principal Psicólogo; lista de serviços; descrição; fotos; posts periódicos; link do site `https://psicoanajulia.com.br/?utm_source=gbp&utm_medium=organic`.
2. Doctoralia e Psicologia Viva (ou equivalente): nome, endereço e telefone idênticos ao site (NAP).
3. Bio do Instagram: `https://psicoanajulia.com.br/?utm_source=instagram&utm_medium=social`.
4. Pedir avaliações no Google a pacientes satisfeitos, dentro da ética do CFP (sem incentivo, sem roteiro).
5. Google Search Console: enviar `sitemap.xml`; solicitar indexação de cada página nova.
6. Bing Webmaster Tools: verificar o site e enviar `sitemap.xml` (alimenta ChatGPT search e Copilot).
