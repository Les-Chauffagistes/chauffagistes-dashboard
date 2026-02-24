"use client";

import { Check, Copy, LucideProps } from "lucide-react"
import { ForwardRefExoticComponent, useState } from "react"

export default function Code({ children, notCopiable = false }: Readonly<{ children: React.ReactNode, notCopiable?: boolean }>) {
    const [Icon, setIcon] = useState<ForwardRefExoticComponent<LucideProps>>(Copy)

    return (
        <code style={{
            backgroundColor: "rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: 7,
            padding: "5px 10px",
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "fit-content",
            maxWidth: "100%",
        }} className="break">
            {children}
            {!notCopiable && <button style={{ color: "white", backgroundColor: "transparent", border: "none", cursor: "pointer" }} onClick={async () => {
                await navigator.clipboard.writeText(children!.toString())
                setIcon(Check);
                setTimeout(() => setIcon(Copy), 1000);
            }}>
                <Icon size={14} color="var(--foreground)" />
            </button>
            }
        </code>
    )
}