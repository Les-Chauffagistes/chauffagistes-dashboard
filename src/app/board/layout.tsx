import ThemeBody from "../ThemeBody";

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