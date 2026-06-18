import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Oxanium } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "./provider-react-query";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "./navigation";
import NextAuthProvider from "./provider-next-auth";
import { Toaster } from "sonner";
import Script from "next/script";
import InstallButton from "@/components/ui/install";

const oxaniumHeading = Oxanium({
  subsets: ["latin"],
  variable: "--font-heading",
});

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZXC[STREAM]",
  description: "Browse and discover movies",
};
export default function RootLayout({
  children,
  modal,
  player,
  login,
  settings,
  search,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  player: React.ReactNode;
  login: React.ReactNode;
  settings: React.ReactNode;
  search: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        outfit.variable,
        oxaniumHeading.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col custom-scrollbar">
        <Script
          id="pwa-prompt-capture"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        window.addEventListener('beforeinstallprompt', function(e) {
          e.preventDefault();
          window.__pwaPrompt = e;
        });
      `,
          }}
        />
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none',
          });
        }
      `,
          }}
        />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-FW6C6N98F8"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FW6C6N98F8');
            `,
          }}
        />
        <ReactQueryProvider>
          <NextAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                {/* <InstallButton /> */}

                {children}
                <Navigation />
                {modal}
                {player}
                {login}
                {settings}
                {search}
                <Toaster />
              </TooltipProvider>
            </ThemeProvider>
          </NextAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
