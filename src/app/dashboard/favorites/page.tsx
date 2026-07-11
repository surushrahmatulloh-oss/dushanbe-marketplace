import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/listings/listing-card";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await auth();
  const favorites = await prisma.favorite.findMany({
    where: { userId: session!.user!.id },
    include: { listing: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Дӯстдоштаҳо</h2>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <ListingCard key={fav.id} {...fav.listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">Дӯстдоштаҳо холӣ аст</p>
        </div>
      )}
    </div>
  );
}
