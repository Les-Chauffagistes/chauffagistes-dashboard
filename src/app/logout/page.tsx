"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        fetch("/api/session", { method: "DELETE" }).then(() => {
            router.push("/");
        });
    }, [router]);

    return null;
}
