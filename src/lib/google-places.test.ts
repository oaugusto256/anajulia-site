import { test } from "node:test"
import assert from "node:assert/strict"
import { normalizeReviews, formatPublishedLabel } from "./google-places.ts"

const base = {
  authorAttribution: { displayName: "Fulana", photoUri: "https://x/p.jpg" },
}

test("normalizeReviews orders newest-first regardless of input order", () => {
  const out = normalizeReviews([
    { ...base, rating: 5, text: { text: "older" }, publishTime: "2026-04-10T00:00:00Z" },
    { ...base, rating: 5, text: { text: "newest" }, publishTime: "2026-08-07T00:00:00Z" },
    { ...base, rating: 5, text: { text: "middle" }, publishTime: "2026-05-22T00:00:00Z" },
  ])
  assert.deepEqual(
    out.map((r) => r.text),
    ["newest", "middle", "older"],
  )
})

test("normalizeReviews drops non-5-star and empty-text reviews", () => {
  const out = normalizeReviews([
    { ...base, rating: 4, text: { text: "four stars" }, publishTime: "2026-08-01T00:00:00Z" },
    { ...base, rating: 5, text: { text: "" }, publishTime: "2026-08-02T00:00:00Z" },
    { ...base, rating: 5, publishTime: "2026-08-03T00:00:00Z" },
    { ...base, rating: 5, text: { text: "kept" }, publishTime: "2026-08-04T00:00:00Z" },
  ])
  assert.deepEqual(
    out.map((r) => r.text),
    ["kept"],
  )
})

test("reviews without publishTime sort last and get an empty label", () => {
  const out = normalizeReviews([
    { ...base, rating: 5, text: { text: "no date" } },
    { ...base, rating: 5, text: { text: "dated" }, publishTime: "2026-01-01T00:00:00Z" },
  ])
  assert.deepEqual(
    out.map((r) => r.text),
    ["dated", "no date"],
  )
  assert.equal(out[1].publishedLabel, "")
  assert.equal(out[1].publishTime, "")
})

test("formatPublishedLabel returns capitalized pt-BR month + year", () => {
  assert.equal(formatPublishedLabel("2026-08-07T01:18:16Z"), "Agosto de 2026")
})

test("formatPublishedLabel returns empty string for missing or invalid input", () => {
  assert.equal(formatPublishedLabel(undefined), "")
  assert.equal(formatPublishedLabel(""), "")
  assert.equal(formatPublishedLabel("not-a-date"), "")
})
