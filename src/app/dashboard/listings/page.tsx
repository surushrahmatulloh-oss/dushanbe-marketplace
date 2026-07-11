import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { DeleteListingButton } from "@/components/listings/delete-listing-button";

export const dynamic = "force-dynamic";

export default async function MyListingsPage() {
  const session = await auth();
  const listings = await prisma.listing.findMany({
    where: { userId: session!.user!.id },
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  const statusLabels: Record<string, string> = {
    DRAFT: "Қоралама",
    PENDING: "Интизорӣ",
    ACTIVE: "Фаъол",
    SOLD: "Фурӯхташуда",
    REJECTED: "Радшуда",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Эълонҳои ман</h2>
        <Link href="/sell">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Нав
          </Button>
        </Link>
      </div>

      {listings.length > 0 ? (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">{listing.category.name}</Badge>
                  <Badge variant="outline">{statusLabels[listing.status]}</Badge>
                </div>
                <Link
                  href={`/listing/${listing.id}`}
                  className="font-medium hover:text-primary transition-colors line-clamp-1"
                >
                  {listing.title}
                </Link>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatPrice(listing.price)} · {listing.views} намоиш
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <DeleteListingButton listingId={listing.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground mb-4">Эълон нест</p>
          <Link href="/sell">
            <Button>Эълон гузоред</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
