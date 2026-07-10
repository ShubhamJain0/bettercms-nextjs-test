import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BetterCMS Next.js Test",
  description: "BetterCMS content demo with authors and blog posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
          <nav className="mx-auto flex w-full max-w-5xl items-center gap-6 px-6 py-4 text-sm font-medium">
            <Link
              className="text-zinc-950 transition hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
              href="/"
            >
              Home
            </Link>
            <Link
              className="text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
              href="/blog"
            >
              Blog
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
