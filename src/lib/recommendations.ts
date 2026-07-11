import { prisma } from "@/lib/prisma";

export async function recordView(listingId: string, userId?: string) {
  await prisma.viewHistory.create({
    data: { listingId, userId: userId ?? null },
  });
  await prisma.listing.update({
    where: { id: listingId },
    data: { views: { increment: 1 } },
  });
}

export async function getTrendingListings(limit = 8) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const recentViews = await prisma.viewHistory.groupBy({
    by: ["listingId"],
    where: { viewedAt: { gte: weekAgo } },
    _count: { listingId: true },
    orderBy: { _count: { listingId: "desc" } },
    take: limit,
  });

  if (recentViews.length === 0) {
    return prisma.listing.findMany({
      where: { status: "ACTIVE" },
      orderBy: { views: "desc" },
      take: limit,
    });
  }

  const ids = recentViews.map((v) => v.listingId);
  const listings = await prisma.listing.findMany({
    where: { id: { in: ids }, status: "ACTIVE" },
  });

  return ids
    .map((id) => listings.find((l) => l.id === id))
    .filter(Boolean) as typeof listings;
}

export async function getRecommendedForUser(userId: string, limit = 8) {
  const views = await prisma.viewHistory.findMany({
    where: { userId },
    orderBy: { viewedAt: "desc" },
    take: 20,
    include: { listing: { select: { categoryId: true, price: true } } },
  });

  if (views.length === 0) {
    return prisma.listing.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  const categoryIds = Array.from(new Set(views.map((v) => v.listing.categoryId)));
  const avgPrice =
    views.reduce((s, v) => s + v.listing.price, 0) / views.length;

  return prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      categoryId: { in: categoryIds },
      price: { gte: avgPrice * 0.5, lte: avgPrice * 1.5 },
      id: { notIn: views.map((v) => v.listingId) },
    },
    orderBy: { views: "desc" },
    take: limit,
  });
}

export async function getAlsoViewed(listingId: string, limit = 4) {
  const viewers = await prisma.viewHistory.findMany({
    where: { listingId },
    select: { userId: true },
    distinct: ["userId"],
    take: 50,
  });

  const userIds = viewers.map((v) => v.userId).filter(Boolean) as string[];
  if (userIds.length === 0) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { categoryId: true, price: true },
    });
    if (!listing) return [];
    return prisma.listing.findMany({
      where: {
        status: "ACTIVE",
        categoryId: listing.categoryId,
        id: { not: listingId },
      },
      take: limit,
    });
  }

  const related = await prisma.viewHistory.groupBy({
    by: ["listingId"],
    where: {
      userId: { in: userIds },
      listingId: { not: listingId },
    },
    _count: { listingId: true },
    orderBy: { _count: { listingId: "desc" } },
    take: limit,
  });

  const ids = related.map((r) => r.listingId);
  return prisma.listing.findMany({
    where: { id: { in: ids }, status: "ACTIVE" },
  });
}

export async function updateShopRating(shopId: string) {
  const reviews = await prisma.review.findMany({
    where: { shopId },
    select: { rating: true },
  });
  if (reviews.length === 0) return;

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  await prisma.shop.update({
    where: { id: shopId },
    data: { rating: Math.round(avg * 10) / 10, reviewCount: reviews.length },
  });
}

export async function validateCoupon(code: string, orderTotal: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    return { valid: false, error: "Купон нодуруст аст" };
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { valid: false, error: "Купон мӯҳлаташ гузаштааст" };
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, error: "Купон истифода шудааст" };
  }
  if (orderTotal < coupon.minOrderAmount) {
    return {
      valid: false,
      error: `Ҳадди ақал фармоиш: ${coupon.minOrderAmount} сомонӣ`,
    };
  }

  const discount =
    coupon.discountType === "PERCENT"
      ? (orderTotal * coupon.value) / 100
      : coupon.value;

  return {
    valid: true,
    discount: Math.min(discount, orderTotal),
    coupon,
  };
}
