import prisma from "@/lib/db/db";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const game = await prisma.game.findFirst();
    if (game) {
      return new NextResponse(JSON.stringify({ success: true, game }), {
        status: 200,
      });
    } else {
      return new NextResponse(
        JSON.stringify({ success: false, message: "No game found" }),
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    console.error("Error fetching game:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Error fetching game" }),
      {
        status: 500,
      }
    );
  }
}
