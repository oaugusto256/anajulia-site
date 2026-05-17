import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Ana Julia Vognach | Psicóloga Clínica em Florianópolis",
  description:
    "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho. CRP 12/30269.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-offwhite font-body antialiased">{children}</body>
    </html>
  )
}
