import prisma from "@/lib/db/db";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(
  req: NextApiRequest,
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
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}
