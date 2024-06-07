import prisma from "@/lib/db/db";
import { pusherServer } from "@/lib/pusher/pusher";
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

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { bet } = await req.json();

    await pusherServer.trigger("channel", "placeBet", {
      teamId: params.id,
      bet: bet,
    });

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}
