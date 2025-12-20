import { Metadata } from "next";
import ThemeBody from "../ThemeBody";

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
    <ThemeBody className={""}>
      {children}
    </ThemeBody>
  );
}