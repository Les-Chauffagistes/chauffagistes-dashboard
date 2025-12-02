"use client";

import "./workersManager.css";
import { greeting } from "../../../../../../lib/Greeting";
import { LinkedWorkers } from "../../../../../../models/API Payloads/LinkedWorkers";
import Link from "next/link";
import { usersModel } from "../../../../../../generated/prisma/models";
import { Computer, Wallet } from "lucide-react";



export default function WorkerManager({ user, linkedWorkers,address, setOpen }: { user: usersModel, linkedWorkers: LinkedWorkers[], address: string, setOpen: (open: boolean) => void }) {
    
    if (!user.pseudo) return null // Affiché uniquement quand la config du compte est finie, donc username existe
    if (linkedWorkers === null) {
        return (
            <div className="card" style={{ margin: "auto", height: "fit-content" }}>
                <h4>{greeting(user.pseudo)}</h4>
                <p>Chargement...</p>
            </div>
        )
    }
    else if (linkedWorkers.length === 0) {
        return (
            <div className="card">
                <h4 style={{ marginBottom: 10 }}>{greeting(user.pseudo)}</h4>
                <p style={{ marginBottom: 4 }}>Aucun workername lié, pour le moment...</p>
                <p style={{ marginBottom: 40 }}>Associez un workername à votre compte pour et définissez votre adresse de paiement</p>
                <div style={{
                    display: "flex",
                    alignItems: "stretch",
                    gap: 10,
                    justifyContent: "center"
                }}>
                    <Link href={`/start/${address}`}>
                        <button className="primary">
                            <div>
                                <h2>
                                    Commencer
                                </h2>
                                <p>Réservez, validez, enregistrez !</p>
                            </div>
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    else {
        return (
            <div className="card" style={{ width: "100%" }}>
                <h2 style={{ margin: "auto 30px 30px 30px", textAlign: "center" }}>{greeting(user.pseudo)}</h2>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 10
                }}>
                    <Computer size={22} />
                    <h4>Workername</h4>
                </div>
                <p style={{ marginBottom: 20 }}>{linkedWorkers[0].workername}</p>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 10
                }}>
                    <Wallet size={22} />
                    <h4>Adresse de réception</h4>
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10
                }}>
                    <p className="break">{user.address ?? "Non définie"}</p>
                    <button onClick={() => setOpen(true)} className="tertiary" style={{marginLeft: "auto"}}>Modifier</button>
                </div>
            </div>
        )
    }
}