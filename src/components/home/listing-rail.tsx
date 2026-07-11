import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ListingCard } from "@/components/listings/listing-card";
import { cn } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  price: number;
  images: string;
  location?: string | null;
  condition?: string;
  type?: string;
}

interface ListingRailProps {
  title: string;
  href?: string;
  listings: Listing[];
  className?: string;
}

export function ListingRail({ title, href, listings, className }: ListingRailProps) {
  if (listings.length === 0) return null;

  return (
    <section className={cn("py-4", className)}>
      <div className="flex items-center justify-between px-4 mb-3">
        {href ? (
          <Link href={href} className="flex items-center gap-1 group">
            <h2 className="text-lg font-bold">{title}</h2>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        ) : (
          <h2 className="text-lg font-bold">{title}</h2>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1">
        {listings.map((listing) => (
          <ListingCard key={listing.id} {...listing} compact />
        ))}
      </div>
    </section>
  );
}
