"use client";

import { signOut } from "next-auth/react";




export default function LogoutPage() {
    signOut()
    fetch("/api/session", {method: "DELETE"})

}