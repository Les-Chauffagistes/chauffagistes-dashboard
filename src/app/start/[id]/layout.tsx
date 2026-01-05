// /src/app/layout.tsx
import ThemeBody from "@/app/ThemeBody";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pool Chauffagistes",
  description: "Commencer à miner chez Les Chauffagistes. Procédure pas à pas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <ThemeBody className="">
        {children}
      </ThemeBody>

  );
}