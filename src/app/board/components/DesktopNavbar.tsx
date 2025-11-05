"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


export function DesktopNavbar() {
    const path = usePathname();
    return (
        <div style={{
            display: "flex",
            gap: 20,
            width: "100%",
            fontSize: "1.2rem",
            padding: 10,
            backgroundColor: "var(--gray)",
        }}>
            <Link href="workers">
                <div  className={path.endsWith('workers') ? "active" : ""}>
                    Workers
                </div>
            </Link>
            <Link href="welcome">
                <div  className={path.endsWith('welcome') ? "active" : ""}>
                    Accueil
                </div>
            </Link>
            <Link href="my">
                <div className={path.endsWith("my") ? "active" : ""}>
                    Profil
                </div>
            </Link>
        </div>
    )
}