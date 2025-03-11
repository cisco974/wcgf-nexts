import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: {
        title: "asc",
      },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
