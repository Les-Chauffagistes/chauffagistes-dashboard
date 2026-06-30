"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import WorkerManager from "./components/WorkersManager";
import InviteFriends from "./components/InviteFriends";
import { getLinkedWorkers, patchUser } from "@/app/api";
import Popup from "@/app/components/Popup";
import WorkerHint from "./components/WorkerHint";
import { LinkedWorkers } from "@/../models/API Payloads/LinkedWorkers";
import { greeting } from "@/lib/Greeting";
import { config } from "@/lib/config";
import { logOut } from "@/lib/auth";
import Image from "next/image";
import "./styles.css";


type User = { id: string, pseudo: string, address: string | null }

export default function LoginPage() {
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const addressRef = useRef<HTMLInputElement>(null);
    const [linkedWorkers, setLinkedWorkers] = useState<LinkedWorkers[] | null>(null);

    const path = usePathname();

    const userAddress = path.split("/")[2];

    useEffect(() => {
        async function getOrCreateUser() {
            const res = await fetch("/api/user");
            if (!res.ok) return;
            const user = await res.json();
            setUser(user);
        }

        getOrCreateUser().then(console.log);
    }, []);

    useEffect(() => {
        if (!user) return;
        getLinkedWorkers(userAddress).then(d => setLinkedWorkers(d));
    }, [user, userAddress]);


    if (user === null) return <p className="profile-loading">Relecture de la blockchain...</p>;
    if (user) {
        if (user.pseudo && linkedWorkers !== null) {
            function updateAddress() {
                if (addressRef.current === null) return;
                patchUser({address: addressRef.current.value});
            }

            return (
                <>
                    <Popup title="Modifier l'adresse" open={open} setOpen={setOpen} handler={updateAddress}>
                        <input ref={addressRef} type="text" id="popup-input" defaultValue={user.address ?? ""}/>
                    </Popup>
                    <div className="profile-page">
                        <div className="profile-header">
                            <Image src="/brand-icon.png" alt="logo" width={64} height={64} quality={100}/>
                            <h1>{greeting(user.pseudo)}</h1>
                            <p>Gérez votre compte et vos mineurs</p>
                        </div>
                        <div className="profile-content">
                            <WorkerManager user={user} address={userAddress} setOpen={setOpen}
                                           linkedWorkers={linkedWorkers}/>
                            {linkedWorkers.length > 0 && <WorkerHint linkedWorkers={linkedWorkers}/>}
                            <InviteFriends userAddress={userAddress}/>
                            <button className="danger" style={{margin: "10px auto 0"}} onClick={async () => {
                                await logOut();
                            }}>Déconnexion
                            </button>
                        </div>
                    </div>
                </>
            );
        }
    }

    return <a href={`${config.AUTH_URL}/login?redirect=${config.BASE_URL}${path}`}>Se connecter</a>;
}
