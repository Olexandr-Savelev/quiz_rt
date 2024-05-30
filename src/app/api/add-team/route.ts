import { pusherServer } from "@/lib/pusher";

export async function GET(req: Request) {}

export async function POST(req: Request) {
  const { id, name, points, bet } = await req.json();
  await pusherServer.trigger("channel", "addTeam", {
    id: id,
    name: name,
    points: points,
    bet: bet,
  });
  return new Response(JSON.stringify({ success: true }));
}
