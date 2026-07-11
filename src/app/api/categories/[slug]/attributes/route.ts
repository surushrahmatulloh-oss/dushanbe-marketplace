import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseAttributeOptions } from "@/lib/attribute-filters";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    select: { id: true, parentId: true },
  });

  if (!category) {
    return NextResponse.json({ error: "Категория ёфт нашуд" }, { status: 404 });
  }

  const attrCategoryId = category.parentId ?? category.id;
  const attributes = await prisma.categoryAttribute.findMany({
    where: { categoryId: attrCategoryId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(
    attributes.map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      type: a.type,
      options: parseAttributeOptions(a.options),
    }))
  );
}
