



export default function NameCell({ workerName, isOnline } : { workerName: string, isOnline: boolean }) {
    return (
        <div style={{display: "flex", alignItems: "center", gap: 10, overflow: "hidden"}}>
            <div style={{backgroundColor: isOnline ? "green" : "red", width: 10, height: 10, borderRadius: "50%", overflow: "hidden", minWidth: 10}}></div>
            <p>{workerName}</p>
        </div>
    )
}