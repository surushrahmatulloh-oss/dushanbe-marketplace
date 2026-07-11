import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  const userId = session.user.id;
  const listings = await prisma.listing.findMany({
    where: { userId },
    select: { id: true, title: true, views: true, price: true, createdAt: true },
  });

  const listingIds = listings.map((l) => l.id);

  const [orders, orderItems, reviews] = await Promise.all([
    prisma.order.findMany({
      where: { items: { some: { listingId: { in: listingIds } } } },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.orderItem.findMany({
      where: { listingId: { in: listingIds } },
      include: { order: true },
    }),
    prisma.review.findMany({
      where: { listingId: { in: listingIds } },
    }),
  ]);

  const totalViews = listings.reduce((s, l) => s + l.views, 0);
  const totalRevenue = orderItems
    .filter((oi) => oi.order.status === "DELIVERED")
    .reduce((s, oi) => s + oi.price * oi.quantity, 0);

  const pendingOrders = orders.filter(
    (o) => !["DELIVERED", "CANCELLED"].includes(o.status)
  ).length;

  const viewsByListing = listings
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((l) => ({ name: l.title.slice(0, 20), views: l.views }));

  const last30Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const revenueByDay = last30Days.map((day) => {
    const dayRevenue = orderItems
      .filter(
        (oi) =>
          oi.order.status === "DELIVERED" &&
          oi.order.createdAt.toISOString().slice(0, 10) === day
      )
      .reduce((s, oi) => s + oi.price * oi.quantity, 0);
    return { date: day.slice(5), revenue: dayRevenue };
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return NextResponse.json({
    totalViews,
    totalRevenue,
    pendingOrders,
    listingsCount: listings.length,
    avgRating: Math.round(avgRating * 10) / 10,
    viewsByListing,
    revenueByDay,
    conversionRate:
      totalViews > 0
        ? Math.round((orderItems.length / totalViews) * 10000) / 100
        : 0,
  });
}
