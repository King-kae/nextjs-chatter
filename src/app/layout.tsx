"use client";

import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import React from "react";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Providers from "./QueryProvider/Provider";
import { Toaster } from "sonner";
import { useLogoutModal } from "./hook/useModal";
import LogoutModal from "./components/Modal/LogoutModal";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoutModal = useLogoutModal();

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <title>Chatter — read, write, connect</title>
        <link rel="icon" href="/logo.jpg" />
        <meta
          name="description"
          content="Chatter is a colorful, modern home for the stories you write and the people you follow."
        />
      </head>
      <SessionProvider>
        <Providers>
          <body className="font-sans">
            <Toaster richColors position="top-center" closeButton />
            {children}
            {logoutModal.isOpen && <LogoutModal />}
          </body>
        </Providers>
      </SessionProvider>
    </html>
  );
}
