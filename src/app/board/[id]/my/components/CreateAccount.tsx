"use client";

import { useRef } from "react"



export default function CreateAccount({ continueHandler }: { continueHandler: (username: string) => void}) {
    const inputRef = useRef<HTMLInputElement>(null)
    return (
        <div style={{
            margin: "auto",
            maxWidth: 750,
            backgroundColor: "var(--card-background-color)",
            padding: 20,
            border: "1px solid var(--card-outline-color)",
            borderRadius: 20
        }}>
            <h2 style={{
                marginBottom: 15
            }}>Créer un compte chez Les Chauffagistes</h2>
            <p>Un compte chez Les Chauffagistes vous permet d&apos;associer des mineurs à votre compte et de renseigner une adresse de paiement. Pour commencer, ajoutez un pseudo :</p>
            <div style={{
                margin: "40px auto",
                width: "fit-content"
            }}>
                <p>Pseudo :</p>
                <input style={{
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid var(--card-background-color)",
                    margin: "5px 0",
                    minWidth: 200,
                    fontSize: "0.8rem"
                }} placeholder="Heatman" type="text" ref={inputRef}/>
            </div>
            <button style={{
                display: "block",
                margin: "20px 5px 5px auto"
            }} className="primary" onClick={() => {
                if (inputRef.current) continueHandler(inputRef.current.value)}}>Continuer</button>
        </div>
    )
}