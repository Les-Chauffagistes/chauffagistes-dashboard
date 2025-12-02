"use client";

import { useEffect } from "react";


export default function LoginPage() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    }, []);
}