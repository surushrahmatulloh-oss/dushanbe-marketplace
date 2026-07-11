import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateShopRating } from "@/lib/recommendations";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId");
  const shopId = searchParams.get("shopId");
  const rating = searchParams.get("rating");

  const where: Record<string, unknown> = {};
  if (listingId) where.listingId = listingId;
  if (shopId) where.shopId = shopId;
  if (rating) where.rating = parseInt(rating);

  const reviews = await prisma.review.findMany({
    where,
    include: { user: { select: { name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  try {
    const { listingId, shopId, rating, comment, images } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Баҳо аз 1 то 5" }, { status: 400 });
    }

    let isVerifiedPurchase = false;
    if (listingId) {
      const order = await prisma.orderItem.findFirst({
        where: {
          listingId,
          order: { userId: session.user.id, status: "DELIVERED" },
        },
      });
      isVerifiedPurchase = !!order;
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        listingId,
        shopId,
        rating,
        comment,
        images: JSON.stringify(images || []),
        isVerifiedPurchase,
      },
      include: { user: { select: { name: true } } },
    });

    if (shopId) await updateShopRating(shopId);

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Хатогии сервер" }, { status: 500 });
  }
}
