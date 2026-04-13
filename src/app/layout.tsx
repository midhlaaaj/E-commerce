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

import { AuthProvider } from "@/hooks/useAuth";
import { RealtimeStoreSync } from "@/components/providers/RealtimeStoreSync";
import QueryProvider from "@/components/providers/QueryProvider";
import { RealtimeDatabaseSync } from "@/components/providers/RealtimeDatabaseSync";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-white font-sans antialiased", roboto.variable)}>
        <AuthProvider>
          <QueryProvider>
            <RealtimeStoreSync>
              <RealtimeDatabaseSync>
                {children}
              </RealtimeDatabaseSync>
            </RealtimeStoreSync>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
