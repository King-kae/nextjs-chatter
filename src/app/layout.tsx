"use client";

import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Providers from "./QueryProvider/Provider";
import Toast from "./components/Toast";
import { useRegisterModal } from "./hook/useModal";
import LogoutModal from "./components/Modal/LogoutModal";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const registerModal = useRegisterModal();
  return (
    <html lang="en">
      <head>
        <title>Chatter App</title>
        <meta name="description" content="A Chattable App" />
      </head>
      <SessionProvider>
        <Providers>
          <body className={inter.className}>
            <Toast />
            {children}
            {registerModal.isOpen && <LogoutModal />} </body>
        </Providers>
      </SessionProvider>
    </html>
  );
}
