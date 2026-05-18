import sharp from "sharp"
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")
const svg = readFileSync(resolve(root, "public/favicon.svg"))

await Promise.all([
  sharp(svg).resize(16, 16).png().toFile(resolve(root, "public/favicon-16x16.png")),
  sharp(svg).resize(32, 32).png().toFile(resolve(root, "public/favicon-32x32.png")),
  sharp(svg).resize(180, 180).png().toFile(resolve(root, "public/apple-touch-icon.png")),
])

console.log("Favicons generated: 16x16, 32x32, apple-touch-icon (180x180)")
