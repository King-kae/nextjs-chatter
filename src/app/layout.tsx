"use client";

import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Providers from "./QueryProvider/Provider";
import Toast from "./components/Toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Chatter App</title>
        <meta name="description" content="A Chattable App" />
      </head>
      <SessionProvider>
        <Providers>
          <body className={inter.className}><Toast />{children}</body>
        </Providers>
      </SessionProvider>
    </html>
  );
}
