// /src/app/layout.tsx

import "./globals.css";
import AuthWrapper from "./authWrapper";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <AuthWrapper>
        {children}
      </AuthWrapper>
    </html>
  );
}