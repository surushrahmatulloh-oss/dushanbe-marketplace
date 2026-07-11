"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatPrice, parseImages } from "@/lib/utils";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  images: string;
  location?: string | null;
  condition?: string;
  type?: string;
  createdAt?: Date | string;
  className?: string;
  /** Карточкаи танг барои лентаи уфуқӣ (Somon) */
  compact?: boolean;
}

export function ListingCard({
  id,
  title,
  price,
  images,
  location,
  className,
  compact = false,
}: ListingCardProps) {
  const imageList = parseImages(images);
  const imageUrl = imageList[0] || "/placeholder.svg";

  return (
    <Link
      href={`/listing/${id}`}
      className={cn(
        "group block shrink-0",
        compact ? "w-[46vw] max-w-[200px] sm:w-[180px]" : "w-full",
        className
      )}
    >
      <article>
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl bg-muted",
            compact ? "aspect-[4/3]" : "aspect-[4/3]"
          )}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes={compact ? "200px" : "(max-width: 768px) 100vw, 25vw"}
          />
        </div>
        <div className="pt-2.5 space-y-0.5 px-0.5">
          <p className="text-[15px] sm:text-base font-bold text-primary leading-tight">
            {price === 0 ? "Музокира" : formatPrice(price)}
          </p>
          <p className="text-[13px] text-foreground/80 line-clamp-2 leading-snug">
            {title}
          </p>
          {location && (
            <p className="text-[11px] text-muted-foreground/70 truncate">{location}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
