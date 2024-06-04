import prisma from "@/lib/db/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const { name, points } = await req.json();

    const team = await prisma.team.create({
      data: {
        name: name,
        points: points,
      },
    });

    await pusherServer.trigger("channel", "addTeam", { ...team });

    return new Response(JSON.stringify({ success: true, team }), {
      status: 201,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}
