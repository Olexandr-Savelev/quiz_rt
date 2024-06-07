import prisma from "@/lib/db/db";

import { NextResponse } from "next/server";

export async function GET() {
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

export async function POST() {
  try {
    const existingGame = await prisma.game.findFirst();
    if (existingGame) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Game already exists" }),
        { status: 400 }
      );
    }

    const game = await prisma.game.create({
      data: {},
    });

    return new NextResponse(JSON.stringify({ success: true, game }), {
      status: 201,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const existingGame = await prisma.game.findFirst();
  if (existingGame) {
    const game = await prisma.game.delete({
      where: {
        id: existingGame.id,
      },
    });
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
}
