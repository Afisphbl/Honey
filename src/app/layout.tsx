import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { CartDrawer } from "@/components/cart/cart-drawer";
import "./globals.css";

const serifFont = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Honey | Single-Origin Artisanal Honey Storefront",
  description:
    "Pure single-origin raw honey harvested with sustainable apiculture. Explore raw varieties, tasting profiles, and interactive floral origin storytelling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-cream text-charcoal">
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
