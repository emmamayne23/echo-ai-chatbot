import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";


const interFont = Bricolage_Grotesque({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Echo AI - Your AI Assistant",
  description: "Whatever you need, Echo is here to help.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={interFont.className}
      >
        {children}
      </body>
    </html>
  );
}
