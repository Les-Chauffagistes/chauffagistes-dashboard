import { useState } from "react";
import { Users } from "lucide-react";

export default function InviteFriends({ userAddress }: { userAddress: string }) {
    const url = `https://heatboard.chauffagistes-btc.fr/start/${userAddress}`;
    const [label, setLabel] = useState("Inviter");

    const share = async (): Promise<"api" | "clipboard" | "clipboard-legacy"> => {
        if (navigator.share) {
            await navigator.share({
                title: "Pool Chauffagistes",
                text: "Le projet de minage Bitcoin français qui valorise la chaleur des mineurs",
                url,
            });
            return "api";
        }

        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(url);
            return "clipboard";
        }

        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        return "clipboard-legacy";
    };

    const onClick = async () => {
        const result = await share();
        if (result !== "api") {
            setLabel("Copié !");
            setTimeout(() => setLabel("Inviter"), 2000);
        }
    };

    return (
        <div className="profile-section">
            <div className="profile-section-header">
                <div className="profile-section-icon"><Users size={18} /></div>
                <h3>Inviter vos amis</h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--secondary-white-text-color)", marginBottom: 14 }}>
                Plus on mine ensemble, plus on a de chances de trouver un bloc.
            </p>
            <button onClick={onClick} className="secondary" style={{ width: "100%" }}>{label}</button>
        </div>
    );
}
