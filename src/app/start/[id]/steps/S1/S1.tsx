"use client";
import { useState } from "react";
import { mutate } from "swr";
import LNQR from "@/app/board/[id]/my/components/LNQR";
import { useMediaQuery } from "@mui/material";
import "./s1.css"
import Step from "../../components/Step";


export default function S1({ lnurl, userAddress, setOpen }: { lnurl: string | null, userAddress: string, setOpen: (open: boolean) => void }) {
    const isSmallScreen = useMediaQuery("(max-width: 600px)");
    const [showForm, setShowForm] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/auth/credentials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error ?? "Erreur inconnue");
                return;
            }
            await mutate("/api/session");
        } catch {
            setError("Erreur réseau");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            display: "flex",
            gap: 30,
            height: "100%"
        }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Step number={1} title="Authentification" />
                <p>Nous utilisons Lightning comme méthode non KYC d&apos;authentification. Ce compte vous permet de gérer votre workername depuis le dashboard.</p>
                <p>Pour commencer, scannez ce QR Code avec un wallet Lightning (Wallet of Satoshi etc.)</p>
                <div id="buttons" style={{
                    marginTop: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10
                }}>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button style={{ display: 'block' }} className="secondary" onClick={() => {
                            window.location.href = "/api/auth/discord?redirect=/start/" + userAddress;
                        }}>Utiliser Discord</button>

                        {isSmallScreen ? <button className="primary" onClick={() => setOpen(true)}>Utiliser Lightning</button> : null}

                        <button className="secondary" onClick={() => setShowForm(!showForm)}>Avec identifiant</button>
                    </div>
                    {showForm && (
                        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                            <input
                                type="text"
                                placeholder="Nom d'utilisateur"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                minLength={3}
                                maxLength={30}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                            <button type="submit" className="primary" disabled={loading}>
                                {loading ? "..." : "Valider"}
                            </button>
                            {error && <p style={{ color: "#e04040", margin: 0, fontSize: "0.85rem" }}>{error}</p>}
                        </form>
                    )}
                </div>
            </div>
            {isSmallScreen ?
                null :
                <div>
                    <LNQR key={lnurl ?? "placeholder"} lnurl={lnurl ?? "azertyuioplkjhgfdsqwxcvbn,nbvcdfty"} show={!!lnurl} disableShadow/>
                </div>
            }

        </div>
    )
}
