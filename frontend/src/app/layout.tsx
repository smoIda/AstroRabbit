import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import NewsFlashBB from "next/font/local";

import { Menu } from "@/components/layout/menu";
import { QueryProvider } from "@/components/providers/tanstack-provider";
import { ContentProvider } from "@/components/providers/content-provider";

import "@/app/globals.css";

export const headline = NewsFlashBB({
  src: "../assets/fonts/news-flash-bb.woff2",
  variable: "--font-headline",
});

export const paragraph = Outfit({
  variable: "--font-paragraph",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Astro Rabbit",
  description: "Your icon library (how generic)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headline.variable} ${paragraph.variable} flex items-start antialiased`}
      >
        <QueryProvider>
          <ContentProvider>
            <Menu />

            {children}
          </ContentProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

//----------- IMPORT ORDER -----------//

/*
  "^react$",
  "",
  "<BUILTIN_MODULES>",
  "",
  "<THIRD_PARTY_MODULES>",
  "",
  "^@/app/(.*)$",
  "",
  "^@/components/(.*)$",
  "",
  "^@/hooks/(.*)$",
  "",
  "^@/lib/(.*)$",
  "",
  "^[./]"
*/

// 2/7/2026
