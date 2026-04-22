import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cholesterol Tracker",
  description: "Track your cholesterol levels over time with lab result uploads and visualizations.",
  openGraph: {
    title: "Cholesterol Tracker",
    description: "Track your cholesterol levels over time with lab result uploads and visualizations.",
    url: "https://itstiffchen.github.io/cholesterol-tracker",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} scroll-smooth`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
