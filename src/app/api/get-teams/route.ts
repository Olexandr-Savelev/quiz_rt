import prisma from "@/lib/db/db";

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
