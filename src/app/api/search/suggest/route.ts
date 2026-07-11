import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { expandSearchQuery, fuzzyMatch, TRENDING_SEARCHES } from "@/lib/marketplace";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json({
      listings: [],
      categories: [],
      trending: TRENDING_SEARCHES,
    });
  }

  const terms = expandSearchQuery(q);
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    include: { category: { select: { name: true, slug: true } } },
    take: 50,
  });

  const matchedListings = listings
    .filter(
      (l) =>
        terms.some((t) => fuzzyMatch(l.title, t)) ||
        terms.some((t) => fuzzyMatch(l.description, t)) ||
        fuzzyMatch(l.title, q)
    )
    .slice(0, 8)
    .map((l) => ({
      id: l.id,
      title: l.title,
      price: l.price,
      category: l.category.name,
      slug: l.category.slug,
    }));

  const categories = await prisma.category.findMany({
    where: {
      OR: terms.map((t) => ({ name: { contains: t } })),
    },
    take: 5,
    select: { name: true, slug: true },
  });

  const session = await auth();
  if (session?.user?.id && q.length >= 2) {
    await prisma.searchHistory.create({
      data: { userId: session.user.id, query: q },
    });
  }

  return NextResponse.json({
    listings: matchedListings,
    categories,
    trending: TRENDING_SEARCHES,
  });
}
