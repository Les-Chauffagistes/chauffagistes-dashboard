"use client";

import QRCode from "react-qr-code";
import "./LNQR.css"
import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";


export default function LNQR({ lnurl, show = false, disableShadow = false }: { lnurl: string, show?: boolean, disableShadow?: boolean }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (show) setVisible(true);
    }, [show]);

    return (
        <div
            id="qr"
            className={visible ? "visible" : ""}
            style={{
                background: "white",
                overflow: "hidden",
                borderRadius: 35,
                margin: "auto",
                boxShadow: disableShadow ? "" : "0px 1px 100px 2px var(--orange), 0px 0px 20px 0px #ffffff"
            }}
        >
            <div style={{
                margin: 30
            }}>
                <QRCode style={{
                    width: "max-content"
                }} key={lnurl} value={"lightning:" + lnurl} bgColor="#ffffff00" />
            </div>
            <div style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                gap: 1,
            }}>
                <button
                    style={{
                        width: "50%",
                        borderRadius: 0
                    }}
                    className="primary"
                    onClick={async () => {
                        await navigator.clipboard.writeText(lnurl);
                    }}
                ><div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                }}>
                        <Copy size={12} /> Copier
                    </div>
                </button>


                <Link style={{
                    width: "50%",
                }}
                    href={"lightning:" + lnurl}><button
                        style={{
                            width: "100%",
                            borderRadius: 0
                        }}
                        className="primary"
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                        }}>
                            <ExternalLink size={12} />Ouvrir
                        </div>
                    </button></Link>
            </div>
        </div>
    );
}