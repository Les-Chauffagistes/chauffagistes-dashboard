import { NextResponse } from "next/server";

import { encrypt } from "@/server/websockets";
import getCurrentUser from "../../session/utils";



export async function GET() {
    console.log("generating token")
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({error: "Auth required"}, {status: 401})
    }
    const encryptedToken = encrypt(user.id.toString());
    return NextResponse.json({token: encryptedToken});
}