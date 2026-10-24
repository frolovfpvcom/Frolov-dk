import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { EditMode } from "@/components/EditMode";
import { Footer, Header, TopLinje } from "@/components/Ramme";
import { site } from "@/lib/site";
import { wix } from "@/lib/wix";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Ossip Frolov · Smykker på bestilling",
    template: "%s · Ossip Frolov",
  },
  description:
    "Unikke smykker på bestilling fra guldsmed Ossip Frolovs værksted i Brønshøj. Over 25 års erfaring med vielsesringe, ringe, øreringe og vedhæng i guld og sølv.",
};

export const viewport: Viewport = {
  themeColor: "#eef0ee",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "Ossip Frolov · Guldsmed",
  url: site.url,
  image: wix("3b4bab_84e18caf6adf4b5797dc9ace606ffabb~mv2.jpg", 1200),
  telephone: site.telefonIntl,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Fuglebakkevej",
    addressLocality: "Brønshøj",
    addressRegion: "København",
    addressCountry: "DK",
  },
  paymentAccepted: "MobilePay, kort, kontant, bankoverførsel",
  sameAs: [site.instagram, site.facebook],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da" className={`${bodoni.variable} ${hanken.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <TopLinje />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <EditMode />
      </body>
    </html>
  );
}
