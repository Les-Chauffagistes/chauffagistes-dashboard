'use client';

import { useEffect, useState } from 'react';

interface ThemeBodyProps {
  readonly children: React.ReactNode;
  readonly className: string;
}

export default function ThemeBody({ children, className }: Readonly<ThemeBodyProps>) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Détecte le thème au montage
    const prefersDark = globalThis?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
    setIsDark(prefersDark);

    // Écoute les changements de thème
    const mediaQuery = globalThis?.matchMedia?.('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery?.addEventListener('change', handler);

    return () => mediaQuery?.removeEventListener('change', handler);
  }, []);

  return (
    <body 
      className={className} 
      style={{
        backgroundColor: isDark ? "#1f1f1f" : "#ce8415ff"
      }}
    >
      {children}
    </body>
  );
}
