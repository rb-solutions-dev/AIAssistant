import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// components
import { Toaster } from "@/components/ui/toaster";
import MobileNavbar from "@/components/MobileNavbar";
import { ThemeProvider } from "@/components/theme-provider";

// interfaces
import type { Metadata } from "next";
import { dark } from "@clerk/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appURL = "https://ai-assistant-mu-sepia.vercel.app/";
export const metadata: Metadata = {
  metadataBase: new URL(appURL),
  title: "LexIA - AI Chatbot",
  description:
    "LexIA is an intelligent AI chatbot that helps you with real-time conversations, productivity, and insights.",
  openGraph: {
    title: "LexIA - AI Chatbot",
    description:
      "LexIA is an intelligent AI chatbot that helps you with real-time conversations, productivity, and insights.",
    url: appURL,
    siteName: "LexIA",
    images: [
      {
        url: "/icons/ios/1024.png", // Make sure this file exists in `/public`
        width: 1024,
        height: 1024,
        alt: "LexIA Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LexIA - AI Chatbot",
    description:
      "LexIA is an intelligent AI chatbot that helps you with real-time conversations, productivity, and insights.",
    images: ["/icons/ios/1024.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col h-screen w-screen relative bg-background">
              {children}

              <div className="pb-20" />
              <MobileNavbar />
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
