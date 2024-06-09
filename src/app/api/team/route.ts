import prisma from "@/lib/db/db";
import { pusherServer } from "@/lib/pusher/pusher";
import Team from "@/types/team";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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
    return new NextResponse(JSON.stringify({ success: true, teams }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { data } = await req.json();
  let result: Team[] = [];
  try {
    data.forEach(async (team: Team) => {
      result.push(
        await prisma.team.update({
          where: { id: team.id },
          data: { points: team.points },
        })
      );
    });
    return new NextResponse(JSON.stringify({ success: true, result }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}
