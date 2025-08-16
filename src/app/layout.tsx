import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana Task Rewards",
  description: "Complete tasks, earn SOL, redeem for subscriptions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <BalanceProvider>
            {children}
            <Toaster />
          </BalanceProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
