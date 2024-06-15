import prisma from "@/lib/db/db";
import { pusherServer } from "@/lib/pusher/pusher";
import Team from "@/types/team";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const team = await prisma.team.findUnique({
      where: {
        id: id,
      },
    });

    return new NextResponse(JSON.stringify({ success: true, team }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { bet, points } = await req.json();

    await prisma.team.update({
      where: {
        id: params.id,
      },
      data: {
        bet: bet,
        points: points,
      },
    });

    await pusherServer.trigger("channel", "placeBet", {
      teamId: params.id,
      bet: bet,
      points: points,
    });

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...dataToUpdate }: Team = await req.json();

    const updatedTeam = await prisma.team.update({
      where: {
        id: id,
      },
      data: dataToUpdate,
    });

    await pusherServer.trigger("channel", "updateTeam", updatedTeam);

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.team.delete({
      where: {
        id: params.id,
      },
    });

    await pusherServer.trigger("channel", "deleteTeam", params.id);

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}
