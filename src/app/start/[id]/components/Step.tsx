

export default function Step({ number, title }: { number: number, title: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
            <div style={{ backgroundColor: "var(--orange)", width: 50, height: 50, minWidth: 50, textAlign: "center", borderRadius: 30, alignContent: "center" }}>
                <h1 className="card-number">{number}</h1>
            </div>
            <h1 className="card-name">{title}</h1>
        </div>
    )
}