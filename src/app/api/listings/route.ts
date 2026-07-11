import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listingSchema } from "@/lib/validations";
import { saveListingAttributes } from "@/lib/attribute-filters";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const categoryId = searchParams.get("categoryId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const condition = searchParams.get("condition");
  const type = searchParams.get("type");
  const location = searchParams.get("location");
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    status: "ACTIVE",
  };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (condition) where.condition = condition;
  if (type) where.type = type;
  if (location) where.location = { contains: location };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
    if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
  }

  const orderBy: Record<string, string> =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
      ? { price: "desc" }
      : sort === "popular"
      ? { views: "desc" }
      : { createdAt: "desc" };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: { select: { name: true, slug: true } },
        user: { select: { name: true, avatar: true } },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({ listings, total, page, limit });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = listingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const attributes =
      body.attributes && typeof body.attributes === "object"
        ? (body.attributes as Record<string, string>)
        : undefined;

    const listing = await prisma.listing.create({
      data: {
        userId: session.user.id,
        title: data.title,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        type: data.type,
        condition: data.condition,
        location: data.location,
        images: JSON.stringify(data.images),
        status: "ACTIVE",
      },
    });

    if (attributes && typeof attributes === "object") {
      await saveListingAttributes(listing.id, data.categoryId, attributes);
    }

    return NextResponse.json(listing, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Хатогии сервер" }, { status: 500 });
  }
}
