// /src/app/layout.tsx
import ThemeBody from "@/app/ThemeBody";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Chauffagistes",
  description: "Statistiques détaillée des workers",
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