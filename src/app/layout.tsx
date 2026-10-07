import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Nav } from "@/components/sections/nav";
import { WhatsAppClickTracker } from "@/components/ui/whatsapp-click-tracker";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { brand, meta } from "@/content/site-content";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/seo";
import { siteGraph } from "@/lib/schema";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: meta.title, template: `%s | ${brand.name}` },
  description: meta.description,
  openGraph: {
    siteName: meta.openGraph.siteName,
    locale: meta.openGraph.locale,
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
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
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <body suppressHydrationWarning className="bg-offwhite font-body antialiased">
        <JsonLd data={siteGraph()} />
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
        <WhatsAppClickTracker />
        <AnalyticsProvider />
        <Nav />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
