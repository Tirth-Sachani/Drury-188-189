import type { Metadata } from "next";
import { Playfair_Display, Public_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import GlobalShellWrapper from "@/components/GlobalShellWrapper";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Drury 188-189 | Rated Best Cafe in London",
  description: "A premium cafe experience at Drury 188-189. Editorial design, artisan coffee, and curated menu.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${publicSans.variable} font-sans antialiased bg-napkin text-roast`}
        suppressHydrationWarning
      >
        <StoreProvider>
          <GlobalShellWrapper>
            {children}
          </GlobalShellWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
