import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: true,
      _count: { select: { listings: { where: { status: "ACTIVE" } } } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}
