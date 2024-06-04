import prisma from "@/lib/db/db";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

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

    return new NextResponse(JSON.stringify({ success: true, team }), {
      status: 201,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const teams = await prisma.team.findMany();
    return new Response(JSON.stringify({ success: true, teams }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}
