import type { Metadata } from "next"
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Nav } from "@/components/sections/nav"
import { WhatsAppFloat } from "@/components/ui/whatsapp-float"
import { ScrollTracker } from "@/components/ui/scroll-tracker"

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

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://psicoanajulia.com.br"),
  title: "Ana Julia Vognach | Psicóloga Clínica em Florianópolis",
  description:
    "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho. CRP 12/30269.",
  keywords: [
    "psicóloga florianópolis",
    "psicóloga campeche",
    "saúde mental e trabalho",
    "psicoterapia para adultos",
    "equilíbrio carreira e maternidade",
    "psicologia sistêmica",
    "supervisão clínica para psicólogos",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ana Julia Vognach | Psicóloga Clínica em Florianópolis",
    description:
      "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho.",
    url: "https://psicoanajulia.com.br",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ana Julia Vognach | Psicóloga Clínica em Florianópolis",
    description:
      "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho. CRP 12/30269.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: { rel: "manifest", url: "/site.webmanifest" },
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <body suppressHydrationWarning className="bg-offwhite font-body antialiased">
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <ScrollTracker />
        <Nav />
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  )
}
