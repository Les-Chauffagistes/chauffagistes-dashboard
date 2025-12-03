import { signIn } from "next-auth/react"


export default function Login({userAddress, setOpen}: Readonly<{userAddress: string, setOpen: (open: boolean) => void}>) {
    return (
        <div className="card" style={{ margin: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
            <h1 style={{marginBottom: 20}}>Se connecter ou s&apos;inscrire</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: "fit-content", margin: "auto" }}>
                <button style={{ marginTop: "auto", display: 'block' }} className="secondary" onClick={() => {
                        signIn("discord", { callbackUrl: "/board/" + userAddress + "/my"})
                    }}>Avec Discord</button>
                <p style={{ textAlign: "center" }}>ou</p>
                <button onClick={() => setOpen(true)} className="primary">Avec lightning Network</button>
            </div>
        </div>
    )
}