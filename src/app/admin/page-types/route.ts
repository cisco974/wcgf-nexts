import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const pageTypes = await prisma.pageType.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(pageTypes);
  } catch (error) {
    console.error("Error fetching page types:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
