import { useRef } from "react"
import Step from "../components/Step";



export default function S2({ next }: { next: (psuedo: string) => Promise<boolean> }) {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100%"
        }}>
            <Step number={2} title="Ajouter un pseudo" />
            <div>
                <p>Votre pseudo sera votre seule identité chez Les Chauffagistes</p>
                <p>Ce pseudo n&apos;a pas besoin d&apos;être unique, et n&apos;a pas de lien avec votre workername (le nom de votre mineur)</p>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                flexDirection: "column",

            }}>
                <input ref={inputRef} type="text" style={{
                    padding: "10px 15px",
                    textAlign: "center",
                    fontSize: "1rem",
                    borderRadius: 10,
                    margin: "auto",
                    display: "flex",
                    alignSelf: "center",
                }} />
                <button onClick={async () => {
                    const result = await next(inputRef.current?.value ?? "")
                    if (!result) {
                        alert("Vous ne pouvez pas utiliser un pseudo vide")
                    }
                }} className="primary">Continuer</button>
            </div>
        </div>
    )
}