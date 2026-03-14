import type { Metadata } from "next";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://atlas.redlix.com'),
  title: {
    default: "Atlas | Internal Developer Platform",
    template: "%s | Atlas"
  },
  description: "Internal developer operations platform for the Redlix ecosystem. Manage clients, projects, developer access, and real-time communication.",
  keywords: ["Redlix", "Atlas", "Developer Operations", "Project Management", "Real-time Chat"],
  authors: [{ name: "Redlix Team" }],
  creator: "Redlix",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Atlas | Internal Developer Platform",
    description: "Internal developer operations platform for the Redlix ecosystem.",
    siteName: "Atlas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas | Internal Developer Platform",
    description: "Internal developer operations platform for the Redlix ecosystem.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
