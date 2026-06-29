"use client";

import { useEffect, useRef, useState } from "react";
import { mutate } from "swr";
import CreateAccount from "./components/CreateAccount";
import WorkerManager from "./components/WorkersManager";
import { useSession } from "@/app/hooks/useSession";
import { usePathname } from "next/navigation";
import { getLinkedWorkers, patchUser } from "@/app/api";
import Login from "./components/Login";
import PopupLN from "@/app/start/[id]/steps/S1/Popup";
import Popup from "@/app/components/Popup";
import "./styles.css";
import WorkerHint from "./components/WorkerHint";
import { LinkedWorkers } from "../../../../../models/API Payloads/LinkedWorkers";
import InviteFriends from "./components/InviteFriends";
import { greeting } from "../../../../../lib/Greeting";
import Image from "next/image";

export default function LoginPage() {
    const [k1, setK1] = useState<string | null>(null);
    const [lnurl, setLnurl] = useState<string | null>(null);
    const { user, isLoading, isError, error } = useSession();
    const [open, setOpen] = useState(false);
    const addressRef = useRef<HTMLInputElement>(null);
    const [linkedWorkers, setLinkedWorkers] = useState<LinkedWorkers[] | null>(null);

    const path = usePathname();

    const userAddress = path.split("/")[2];

    useEffect(() => {
        fetch("/api/auth/lnurl")
            .then(r => r.json())
            .then(d => {
                setK1(d.k1);
                setLnurl(d.lnurl);
            });
    }, []);

    useEffect(() => {
        if (!user) return;
        getLinkedWorkers(userAddress).then(d => setLinkedWorkers(d));
    }, [user, userAddress]);

    useEffect(() => {
        if (!k1) return;
        let i: ReturnType<typeof setInterval> | null = null;

        i = setInterval(async () => {
            if (user) { clearInterval(i!) }
            const r = await fetch(`/api/auth/lnurl/status?k1=${k1}`);
            const d = await r.json();

            if (!d.authenticated) return;

            clearInterval(i!);
            i = null;

            await mutate("/api/session")

            setOpen(false);

        }, 1500);

        return () => { if (i) clearInterval(i); };
    }, [k1, user, userAddress]);

    if (isError) {
        if (error.status !== 401) {
            return <p className="profile-loading">Erreur d&apos;authentification</p>
        }
    }
    if (isLoading) return <p className="profile-loading">Relecture de la blockchain...</p>
    if (user) {
        if (user.pseudo && linkedWorkers !== null) {
            function updateAddress() {
                if (addressRef.current === null) return;
                patchUser({ address: addressRef.current.value }).then(() => mutate("/api/session"));
            }

            return (
                <>
                    <Popup title="Modifier l'adresse" open={open} setOpen={setOpen} handler={updateAddress}>
                        <input ref={addressRef} type="text" id="popup-input" defaultValue={user.address ?? ""} />
                    </Popup>
                    <div className="profile-page">
                        <div className="profile-header">
                            <Image src="/brand-icon.png" alt="logo" width={64} height={64} quality={100}/>
                            <h1>{greeting(user.pseudo)}</h1>
                            <p>Gérez votre compte et vos mineurs</p>
                        </div>
                        <div className="profile-content">
                            <WorkerManager user={user} address={userAddress} setOpen={setOpen} linkedWorkers={linkedWorkers} />
                            {linkedWorkers.length > 0 && <WorkerHint linkedWorkers={linkedWorkers} />}
                            <InviteFriends userAddress={userAddress} />
                            <button className="danger" style={{ margin: "10px auto 0" }} onClick={async () => {
                                await fetch("/api/session", { method: "DELETE" });
                                window.location.href = "/";
                            }}>Déconnexion</button>
                        </div>
                    </div>
                </>
            )
        }

        return <CreateAccount continueHandler={(username) => {
            patchUser({ pseudo: username });
            mutate("/api/session");
        }} />
    }

    return (
        <>
            <PopupLN lnurl={lnurl} open={open} setOpen={setOpen} />
            <Login userAddress={userAddress} setOpen={setOpen} />
        </>
    )
}
