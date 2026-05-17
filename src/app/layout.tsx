import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
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

export const metadata: Metadata = {
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
  openGraph: {
    title: "Ana Julia Vognach | Psicóloga Clínica em Florianópolis",
    description:
      "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho.",
    locale: "pt_BR",
    type: "website",
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
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
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
