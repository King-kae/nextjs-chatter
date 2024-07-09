"use client";


import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <title>Chatter App</title>
          <meta name="description" content="A Chattable App" />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </SessionProvider>
  );
}
