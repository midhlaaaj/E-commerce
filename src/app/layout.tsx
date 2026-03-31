import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "ELITEWEAR | Modern Elegance",
  description: "Experience premium fashion and lifestyle with ELITEWEAR.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-white font-sans antialiased", roboto.variable)}>
        <Navbar transparent />
        {children}
      </body>
    </html>
  );
}
