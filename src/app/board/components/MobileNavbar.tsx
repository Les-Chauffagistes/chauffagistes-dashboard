"use client";

import { Computer, Globe, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./mobileNavbar.css"



export default function MobileNavbar() {
    const path = usePathname();
    return (
        <div id="mobile-navbar" style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "100dvw",
            backgroundColor: "var(--mobile-navbar-background-color)",
            paddingTop: 5
        }}>
            <Link href="workers">
                <div className={path.endsWith('workers') ? "mob-nav-active" : ""}>
                    <Computer size={18} />
                    Workers
                </div>
            </Link>
            <Link href="pool">
                <div  className={path.endsWith('pool') ? "mob-nav-active" : ""}>
                    <Globe size={18}/>
                    Pool
                </div>
            </Link>
            <Link href="my">
                <div className={path.endsWith("my") ? "mob-nav-active" : ""}>
                    <User size={18}/>
                    Profil
                </div>
            </Link>
        </div>
    )
}