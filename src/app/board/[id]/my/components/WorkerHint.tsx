import Code from "@/app/components/Code";
import { LinkedWorkers } from "../../../../../../models/API Payloads/LinkedWorkers";
import { Plus } from "lucide-react";

export default function WorkerHint({ linkedWorkers }: { linkedWorkers: LinkedWorkers[] }) {
    return (
        <div className="profile-section">
            <div className="profile-section-header">
                <div className="profile-section-icon"><Plus size={18} /></div>
                <h3>Ajouter un mineur</h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--secondary-white-text-color)", marginBottom: 12 }}>
                Configurez vos machines avec ces paramètres :
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Code>stratum+tcp://chauffagistes-pool.fr:3333</Code>
                <Code>{linkedWorkers[0].btc_address}.{linkedWorkers[0].workername}</Code>
            </div>
        </div>
    );
}
