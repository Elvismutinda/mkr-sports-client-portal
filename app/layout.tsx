import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import AppLayoutWrapper from "./layoutWrapper";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "MKR Sports",
  description: "Find and join local sports matches with ease using MKR Sports. Sign up now to start playing!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen antialiased`}
      >
        <AppLayoutWrapper>
          {children}
          <Toaster richColors theme="dark" />
        </AppLayoutWrapper>
      </body>
    </html>
  );
}
