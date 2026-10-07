/** Content fields are either one paragraph or a list of paragraphs. */
export function asText(value: string | string[]): string {
  return Array.isArray(value) ? value.join(" ") : value
}
