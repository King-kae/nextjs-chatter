"use client";


import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Providers from './QueryProvider/Provider'

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <title>Chatter App</title>
          <meta name="description" content="A Chattable App" />
        </head>
        <Providers>
          <body className={inter.className}>{modal}{children}</body>
        </Providers>
      </html>
    </SessionProvider>
  );
}
