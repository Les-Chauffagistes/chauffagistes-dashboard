// src/app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function LoginPage() {
    const [k1, setK1] = useState<string | null>(null);
    const [lnurl, setLnurl] = useState<string | null>(null);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        fetch("/api/auth/lnurl")
            .then(r => r.json())
            .then(d => {
                setK1(d.k1);
                setLnurl(d.lnurl);
            });
    }, []);

    useEffect(() => {
        if (!k1) return;
        const interval = setInterval(async () => {
            const r = await fetch(`/api/auth/lnurl/status?k1=${k1}`);
            const d = await r.json();
            if (d.authenticated) {
                setAuthenticated(true);
                clearInterval(interval);
                // créer session locale si tu veux (cookies, jwt…)
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [k1]);

    console.log("lnurl", lnurl)
    if (!lnurl) return null;
    if (authenticated) return <div>Connecté.</div>;

    return (
        <div style={{
            backgroundColor: "white",
            padding: 30
        }}>
            <QRCode value={lnurl} />
        </div>
    );
}