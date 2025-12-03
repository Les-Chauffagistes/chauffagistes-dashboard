import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server';
import { decrypt, websockets, resolveUser } from '@/server/websockets';

// app/api/ws/route.ts
export const GET = () => {
  return NextResponse.next();
};

// prévu plus tard
export async function UPGRADE(
  client: import('ws').WebSocket,
  server: import('ws').WebSocketServer,
  request: NextRequest
) {
  console.log('A client connected');
  const url = new URL(request.url, "http://localhost");
  const token = url.searchParams.get("token");

  if (!token) {
    console.warn("no token");
    client.close();
    return;
  }

  const user = await resolveUser(decrypt(token));
  if (!user) {
    console.warn("no user");
    client.close();
    return;
  }

  websockets.set(user.id.toString(), client);
  client.on('close', () => {
    console.log('A client disconnected');
    websockets.delete(user.id.toString());
  });

  client.on("message", (msg) => {
    try {
        const d = JSON.parse(msg.toString());
        if (d.type === "ping") {
            client.send(JSON.stringify({ type: "pong" }));
        }
    } catch {}
});
}