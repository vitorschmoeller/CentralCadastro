import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/providers/auth";
import {ModalProvider} from "@/providers/modal"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Central Cadastro - Seu sistema de cadastro de produtos",
  description: "Gerencie suas marcas e seu produtos de forma facil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <AuthProvider>
          <ModalProvider>
            <Header/>
            {children}
          </ModalProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}
