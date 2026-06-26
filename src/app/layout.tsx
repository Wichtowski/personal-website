import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SlideScrollHandler } from "@/components/layout/SlideScrollHandler";
import { AppLayout } from "@/components/layout/AppLayout";
import { getProjects, getArticles } from "@/lib/mdx";
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
  title: "Oskar Wichtowski | AI Engineer & Software Developer",
  description:
    "Portfolio of Oskar Wichtowski - AI Engineer, Fullstack Software Developer, and Quality Assurance Specialist. Crafting intelligent systems and bulletproof test pipelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-screen w-screen overflow-hidden relative bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <SlideScrollHandler />
            <Navbar />
            <Footer />
            <AppLayout projects={getProjects()} articles={getArticles()}>
              {children}
            </AppLayout>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
