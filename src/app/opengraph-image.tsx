import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"

export const runtime = "nodejs"
export const alt = "Ana Julia Vognach | Psicóloga Clínica em Florianópolis"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  const imageBuffer = readFileSync(
    join(process.cwd(), "public/fotos/IMG_8209.jpg")
  )
  const base64Image = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#F5F2ED",
        }}
      >
        {/* Left: photo */}
        <div
          style={{
            display: "flex",
            width: "50%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={base64Image}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        </div>

        {/* Right: text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
            width: "50%",
          }}
        >
          <span
            style={{
              color: "#6B7C5C",
              fontSize: 22,
              fontStyle: "italic",
              marginBottom: 16,
            }}
          >
            psicóloga clínica
          </span>

          <span
            style={{
              color: "#1A1A18",
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 32,
            }}
          >
            Ana Julia Vognach
          </span>

          <div
            style={{
              width: 56,
              height: 2,
              background: "#6B7C5C",
              marginBottom: 32,
            }}
          />

          <span
            style={{
              color: "#6B6B6B",
              fontSize: 22,
              lineHeight: 1.5,
            }}
          >
            Psicoterapia para adultos em Florianópolis e online.
          </span>

          <span
            style={{
              color: "#6B7C5C",
              fontSize: 18,
              marginTop: 48,
            }}
          >
            psicoanajulia.com.br
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
