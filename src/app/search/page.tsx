import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { expandSearchQuery, fuzzyMatch } from "@/lib/marketplace";
import { ListingCard } from "@/components/listings/listing-card";
import { SearchFilters } from "@/components/listings/search-filters";

export const metadata: Metadata = {
  title: "Ҷустуҷӯ",
};

interface Props {
  searchParams: Record<string, string | undefined>;
}

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: Props) {
  const orderBy =
    searchParams.sort === "price_asc"
      ? { price: "asc" as const }
      : searchParams.sort === "price_desc"
      ? { price: "desc" as const }
      : searchParams.sort === "popular"
      ? { views: "desc" as const }
      : { createdAt: "desc" as const };

  let listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    orderBy,
    take: 100,
  });

  if (searchParams.q) {
    const q = searchParams.q;
    const terms = expandSearchQuery(q);
    listings = listings.filter(
      (l) =>
        fuzzyMatch(l.title, q) ||
        fuzzyMatch(l.description, q) ||
        terms.some((t) => fuzzyMatch(l.title, t) || fuzzyMatch(l.description, t))
    );
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    listings = listings.filter((l) => {
      if (searchParams.minPrice && l.price < parseFloat(searchParams.minPrice)) return false;
      if (searchParams.maxPrice && l.price > parseFloat(searchParams.maxPrice)) return false;
      return true;
    });
  }
  if (searchParams.condition) {
    listings = listings.filter((l) => l.condition === searchParams.condition);
  }
  if (searchParams.type) {
    listings = listings.filter((l) => l.type === searchParams.type);
  }
  if (searchParams.location) {
    listings = listings.filter((l) =>
      l.location?.toLowerCase().includes(searchParams.location!.toLowerCase())
    );
  }

  listings = listings.slice(0, 40);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">
        {searchParams.q ? `Натиҷаҳо барои «${searchParams.q}»` : "Ҷустуҷӯ"}
      </h1>
      <p className="text-muted-foreground mb-8">{listings.length} эълон ёфт шуд</p>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <SearchFilters searchParams={searchParams} />
        </aside>
        <div className="flex-1">
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">Эълон ёфт нашуд</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
