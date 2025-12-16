import { useState } from "react";

export default function InviteFriends({ userAddress }: { userAddress: string }) {
  const url = `https://stats.chauffagistes.fr/start/${userAddress}`;
  const [label, setLabel] = useState("Inviter");

  const share = async (): Promise<"api" | "clipboard" | "clipboard-legacy"> => {
    if (navigator.share) {
      await navigator.share({
        title: "Pool Les Chauffagistes",
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
      setLabel("Copié");
    }
  };

  return (
    <div className="card" style={{ width: "100%" }}>
      <h2 style={{ marginBottom: 20 }}>Inviter vos amis</h2>
      <p>Maximisez vos chances de trouver un bloc en invitant vos amis à s&apos;équiper et à miner chez Les Chauffagistes.</p>
      <button onClick={onClick} className="primary" style={{display: "block", margin: "20px auto 0"}}>{label}</button>
    </div>
  );
}