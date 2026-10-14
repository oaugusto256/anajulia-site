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

4. Configuração única do projeto: Project settings → ative "Discard client IP data". Necessário para que a afirmação da página de privacidade ("anônimas", "não identifica quem visita") seja verdadeira.

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

## Checklist externo (manual, por prioridade)
Origem: export do Search Console de 2026-10-14 (spec `docs/superpowers/specs/2026-10-14-search-performance-design.md`).

1. Doctoralia: a cidade principal do perfil está como Estrela (RS), com Florianópolis/Campeche como segundo endereço. Se o consultório de Estrela não estiver mais ativo, removê-lo para o perfil ficar em Florianópolis; nome, endereço e telefone idênticos ao site (NAP), também no Psicologia Viva (ou equivalente). Se a URL do perfil mudar, atualizar `brand.location.doctoraliaUrl`.
2. Google Business Profile: categoria principal Psicólogo; serviços (psicoterapia individual, casal, familiar, grupo e as quatro áreas); descrição; posts quinzenais com link para as páginas de tema usando `?utm_source=gbp&utm_medium=organic`; fotos recentes do consultório; link do site `https://psicoanajulia.com.br/?utm_source=gbp&utm_medium=organic`.
3. Pedir avaliações no Google a pacientes satisfeitos, dentro da ética do CFP (sem incentivo, sem roteiro).
4. Bio do Instagram: `https://psicoanajulia.com.br/?utm_source=instagram&utm_medium=social`.
5. Google Search Console: enviar `sitemap.xml`; solicitar indexação de cada página nova e da home após mudanças de título/descrição.
6. Bing Webmaster Tools: verificar o site e enviar `sitemap.xml` (alimenta ChatGPT search e Copilot).

## Search Console — revisão periódica
- Próxima revisão: **2026-11-14**. Exportar Desempenho (Web) dos últimos 28 dias e comparar com a linha de base da spec de 2026-10-14 (23 cliques, 481 impressões, CTR 4,8%, posição 4,8; celular CTR 3,09% vs computador 6,88%).
- Sinais de sucesso: as quatro páginas de tema aparecem em Páginas; consultas com "campeche" têm CTR > 0; consultas com "unimed" continuam aparecendo e a home recebe cliques; CTR no celular se aproxima do computador.
- Cruzar com PostHog: `whatsapp_click` com `channel = organic_search` no mesmo período.
- Guardar o export fora do git (pasta `search-data/`, já no `.gitignore`).
