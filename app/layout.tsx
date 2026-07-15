import type { Metadata } from "next";
import Link from "next/link";
import { Instrument_Serif, Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Instrument_Serif({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Northline Studio",
  description: "Stories, signal, and craft from Northline Studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="site-shell min-h-full flex flex-col">
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--paper)_82%,transparent)] backdrop-blur-md">
          <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
            <Link
              className="display text-xl font-bold tracking-tight text-[var(--brand)] transition hover:text-[var(--brand-deep)]"
              href="/"
            >
              Northline
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium tracking-wide text-[var(--ink-soft)]">
              <Link className="transition hover:text-[var(--ink)]" href="/">
                Home
              </Link>
              <Link className="transition hover:text-[var(--ink)]" href="/blog">
                Journal
              </Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="mt-auto border-t border-[var(--line)]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="display text-2xl font-bold text-[var(--brand)]">
                Northline
              </p>
              <p className="mt-2 max-w-md text-base leading-7 text-[var(--ink-soft)]">
                A studio writing about product craft, motion, and content that
                ships.
              </p>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]">
              Content powered by BetterCMS
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
