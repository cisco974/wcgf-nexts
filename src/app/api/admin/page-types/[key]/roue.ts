import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } },
) {
  try {
    // Await params avant d'accéder à ses propriétés
    const resolvedParams = await Promise.resolve(params);
    const key = resolvedParams.key;

    const pageType = await prisma.pageType.findUnique({
      where: { key },
    });

    if (!pageType) {
      return NextResponse.json(
        { error: "Page type not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(pageType);
  } catch (error) {
    console.error("Error fetching page type:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
