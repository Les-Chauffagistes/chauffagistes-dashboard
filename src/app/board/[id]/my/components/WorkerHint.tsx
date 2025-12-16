import { LinkedWorkers } from "../../../../../../models/API Payloads/LinkedWorkers";



export default function WorkerHint({linkedWorkers}: {linkedWorkers: LinkedWorkers[]}) {
    return (
        <div className="card" style={{ width: "100%" }}>
            <h2 style={{
                marginBottom: 20
            }}>Ajouter d&apos;autres mineurs</h2>
            <p>Ajoutez d&apos;autres machines de minage à votre compte en utilisant ce nom d&apos;utilisateur :</p>
            <h3 style={{ margin: "15px 0 5px" }}>Stratum URL</h3>
            <p>stratum+tcp://chauffagistes-pool.fr:3333</p>
            <h3 style={{ margin: "15px 0 5px" }}>User</h3>
            <p className="break">{linkedWorkers[0].btc_address}.{linkedWorkers[0].workername}</p>
        </div>
    )
}