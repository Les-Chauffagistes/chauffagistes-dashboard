"use client";
import LNQR from "@/app/board/[id]/my/components/LNQR";
import { signIn } from "next-auth/react";
import { useMediaQuery } from "@mui/material";
import "./s1.css"
import Step from "../../components/Step";


export default function S1({ lnurl, userAddress, setOpen }: { lnurl: string | null, userAddress: string, setOpen: (open: boolean) => void }) {
    const isSmallScreen = useMediaQuery("(max-width: 600px)");
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
                    display: "flex"
                }}>
                    <button style={{ marginTop: "auto", display: 'block' }} className="secondary" onClick={() => {
                        signIn("discord", { callbackUrl: "/start/" + userAddress })
                    }}>Utiliser Discord</button>
                    
                {isSmallScreen ? <button className="primary" onClick={() =>setOpen(true)}>Utiliser Lightning</button> : null}
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