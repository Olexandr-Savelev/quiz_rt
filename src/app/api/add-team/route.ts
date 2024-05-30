import { pusherServer } from "@/lib/pusher";

export async function GET(req: Request) {}

export async function POST(req: Request) {
  const { team } = await req.json();
  console.log(team);
  await pusherServer.trigger("channel", "addTeam", { team });
  return new Response(JSON.stringify({ success: true }));
}
