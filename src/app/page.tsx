import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTrendingListings, getRecommendedForUser } from "@/lib/recommendations";
import { SomonSearchBar } from "@/components/home/somon-search-bar";
import { StoriesRow } from "@/components/home/stories-row";
import { CategoryGrid } from "@/components/home/category-grid";
import { ListingRail } from "@/components/home/listing-rail";
import { AiSearchBar } from "@/components/search/ai-search-bar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();

  const [
    banners,
    categories,
    listingCount,
    newListings,
    cars,
    phones,
    homes,
    trendingListings,
    recommended,
  ] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 8,
    }),
    prisma.category.findMany({
      where: { parentId: null },
      include: {
        _count: { select: { listings: { where: { status: "ACTIVE" } } } },
      },
      take: 8,
    }),
    prisma.listing.count({ where: { status: "ACTIVE" } }),
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.listing.findMany({
      where: { status: "ACTIVE", category: { slug: { in: ["moshin", "sedan", "suv"] } } },
      orderBy: { views: "desc" },
      take: 12,
    }),
    prisma.listing.findMany({
      where: { status: "ACTIVE", category: { slug: { in: ["telefon", "iphone", "samsung"] } } },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.listing.findMany({
      where: { status: "ACTIVE", category: { slug: { in: ["khona", "kvartira", "hona"] } } },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    getTrendingListings(12),
    session?.user?.id
      ? getRecommendedForUser(session.user.id, 12)
      : Promise.resolve([]),
  ]);

  const stories = banners.map((b) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    image: b.image,
    link: b.link,
  }));

  // Агар баннер кам бошад — аз эълонҳои нав story соз
  const extraStories =
    stories.length < 4
      ? newListings.slice(0, 6 - stories.length).map((l) => {
          let image = "/placeholder.svg";
          try {
            const imgs = JSON.parse(l.images);
            if (Array.isArray(imgs) && imgs[0]) image = imgs[0];
          } catch {
            /* ignore */
          }
          return {
            id: `listing-${l.id}`,
            title: l.title,
            subtitle: null,
            image,
            link: `/listing/${l.id}`,
          };
        })
      : [];

  return (
    <div className="animate-fade-in pb-4">
      <div className="pt-3 space-y-1">
        <SomonSearchBar listingCount={listingCount} />
        <div className="px-4 pt-2">
          <AiSearchBar inline />
        </div>
      </div>

      <StoriesRow stories={[...stories, ...extraStories]} />

      <section className="px-4 py-3">
        <CategoryGrid
          somonStyle
          categories={categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            icon: c.icon,
            count: c._count.listings,
          }))}
        />
      </section>

      {recommended.length > 0 && (
        <ListingRail
          title="Барои шумо"
          href="/search"
          listings={recommended}
        />
      )}

      <ListingRail title="Эълонҳои нав" href="/search" listings={newListings} />

      {cars.length > 0 && (
        <ListingRail title="Нақлиёт" href="/category/moshin" listings={cars} />
      )}

      {homes.length > 0 && (
        <ListingRail
          title="Амволи ғайриманқул"
          href="/category/khona"
          listings={homes}
        />
      )}

      {phones.length > 0 && (
        <ListingRail
          title="Телефонҳо ва алоқа"
          href="/category/telefon"
          listings={phones}
        />
      )}

      {trendingListings.length > 0 && (
        <ListingRail
          title="Трендӣ дар ҳафта"
          href="/search?sort=popular"
          listings={trendingListings}
        />
      )}
    </div>
  );
}
