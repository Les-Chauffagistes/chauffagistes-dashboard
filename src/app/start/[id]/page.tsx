"use client";

import { getLinkedWorkers, getUserToken, registerWorkername } from "@/app/api";
import { useSession } from "@/app/hooks/useSession";
import { useSession as discordSession } from "next-auth/react"
import { usePathname } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import { mutate } from "swr";
import { LinkedWorkers } from "../../../../models/API Payloads/LinkedWorkers";
import S1 from "./steps/S1/S1";
import S2 from "./steps/S2";
import S3 from "./steps/S3";
import S4 from "./steps/S4";
import S5 from "./steps/S5";
import S6 from "./steps/S6";

import "./styles.css";
import PopupLN from "./steps/S1/Popup";



export default function StatPage() {
    const path = usePathname();

    const [open, setOpen] = useState(false);

    const { user, isLoading } = useSession();
    const [userToken, setUserToken] = useState<string | null>(null);
    const discord = discordSession();

    const [lnurl, setLnurl] = useState<string | null>(null);
    const [k1, setK1] = useState<string | null>(null);

    const [linkedWorkers, setLinkedWorkers] = useState<LinkedWorkers[] | null>(null);
    const [currentStep, setCurrentStep] = useState(0);

    const userAddress = path.split("/")[2];

    // Vérification de l'étape à laquelle commencer
    useEffect(() => {
        console.log("user", user);
        if (!user) { setCurrentStep(1); return; }
        if (!userToken) { setCurrentStep(1); return; }
        if (!user?.pseudo) { setCurrentStep(2); return; }
        if (!linkedWorkers || linkedWorkers.length === 0) { setCurrentStep(3); return; }
        if (linkedWorkers[0].status !== "done") { setCurrentStep(4); return; }
        if (!user.address) { setCurrentStep(5); return; }
        setCurrentStep(6);
    }, [user, userToken, linkedWorkers]);

    useEffect(() => {
        console.log("Updating linked workers");
        if (user) {
            console.log("got user")
            getLinkedWorkers(userAddress).then((res) => setLinkedWorkers(res));
            getUserToken().then((res) => setUserToken(res));
        } else {
            console.log("no user");
            setLinkedWorkers([]);
            setUserToken(null);
        }
    }, [user, userAddress])

    useEffect(() => {
        fetch("/api/auth/lnurl")
            .then(r => r.json())
            .then(d => {
                setK1(d.k1);
                setLnurl(d.lnurl);
            });
    }, []);

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

            const workers = await getLinkedWorkers(userAddress);
            setLinkedWorkers(workers);

            const token = await getUserToken();
            setUserToken(token);
            setOpen(false);

            setCurrentStep(2);
        }, 1500);

        return () => { if (i) clearInterval(i); };
    }, [k1, user, userAddress]); // userAddress added to fix build failure. CHECK REQUIRED


    if (isLoading || discord.status === "loading") {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100dvh" }}>Préchauffage...</div>;
    }

    const stack = [];

    if (currentStep >= 1) stack.push(<S1 key={1} userAddress={userAddress} lnurl={user ? null : lnurl} setOpen={setOpen} />);
    if (currentStep >= 2) stack.push(<S2 key={2} next={async (pseudo) => { return await handleS2next(pseudo) }} />);
    if (currentStep >= 3) stack.push(<S3 key={3} userAddress={userAddress} next={handleS3next} />);
    if (currentStep >= 4) stack.push(<S4 key={4} association={linkedWorkers?.[0]} token={userToken!} next={() => setCurrentStep(5)} />);
    if (currentStep >= 5) stack.push(<S5 key={5} next={handleS5next} />);
    if (linkedWorkers?.[0]) {
        if (currentStep >= 6) stack.push(<S6 key={6} address={userAddress} workername={linkedWorkers[0].workername} />);
    }

    async function handleS3next(workername: string): Promise<string | undefined> {
        const result = await registerWorkername(userAddress, workername)

        if ("error" in result) {
            return result.error
        } else {
            await mutate("/api/auth/lnurl/session");
        }
        const fresh = await getLinkedWorkers(userAddress);
        setLinkedWorkers(fresh);
        setCurrentStep(4);
    }

    async function handleS2next(pseudo: string): Promise<boolean> {
        if (pseudo.trim()) {
            await fetch("/api/user", { method: "PATCH", body: JSON.stringify({ pseudo: pseudo }) })
            await mutate("/api/session");
            setCurrentStep(3);
            return true;
        }
        return false;
    }

    function handleS5next() {
        setCurrentStep(6);
    }

    // Stack config
    const stackLen = stack.length;
    const maxTranslate = 30;      // offset initial pour depth=0 → 1
    const maxScaleLoss = 0.5;    // zoom-out maximal cumulé
    const translateFactor = 4;
    const zoomFactor = 5;            // facteur d’amortissement


    return (
        <>
            {/* <Background/> */}
            <div
            // className="btc-bg"
            style={{
                width: "100%",
                height: "100dvh",
                overflow: "auto",
                flexDirection: "column",
                display: "flex",
                backgroundColor: "var(--background)"
            }}>
                <h1 id="title">Enregistrer un mineur chez Les Chauffagistes</h1>

                <p id="description" style={{ margin: "20px 0 40px", textAlign: "center" }}>
                    Pour nous permettre de confirmer que le mineur que vous allez connecter vous appartient, vous allez suivre une procédure de connexion.
                </p>

                <PopupLN key={lnurl ?? "placeholder"} lnurl={lnurl ?? "azertyuioplkjhgfdsqwxcvbn,nbvcdfty"} setOpen={setOpen} open={open} />

                <div id="card-container" style={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    pointerEvents: "none"  // désactive clics sur container (gestion individuelle plus bas)
                }}>
                    {stack.map((card, i) => {
                        // i = 0 => bottom (première poussée), i = stackLen-1 => top
                        const depth = stackLen - i - 1;
                        const f = Math.log1p(depth) / Math.log1p(depth + translateFactor);
                        const zoomF = Math.log1p(depth) / Math.log1p(depth + zoomFactor);
                        const translateY = -maxTranslate * f;
                        const scale = 1 - maxScaleLoss * zoomF;
                        const fade = Math.min(depth * 0.3, 0.8); // ajustable

                        const style = {
                            "--depth-fade": fade,
                            position: "absolute",
                            top: 20,
                            width: Math.min(820, window.innerWidth - 64),
                            maxWidth: "95%",
                            transformOrigin: "top center",
                            transition: "transform 250ms cubic-bezier(.2,.9,.2,1)",
                            pointerEvents: depth === 0 ? "auto" : "none",
                            transform: `translateY(${translateY}px) scale(${scale})`,
                            border: depth === 0 ? "1px solid var(--card-outline-color)" : "",
                            zIndex: i + 50,
                        } as CSSProperties;

                        const isTop = i === stackLen - 1;

                        return (
                            <div
                                key={i}
                                className={`card ${isTop ? "is-top-enter" : "is-behind"}`}
                                style={style}
                            >
                                {card}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}