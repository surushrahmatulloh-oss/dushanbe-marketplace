"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

interface ListingActionsProps {
  listingId: string;
  title: string;
  price: number;
  images: string;
  shopId?: string | null;
  type: string;
  sellerId: string;
  phone?: string | null;
}

export function ListingActions({
  listingId,
  title,
  price,
  images,
  shopId,
  type,
  sellerId,
  phone,
}: ListingActionsProps) {
  if (type === "PRODUCT") {
    return (
      <AddToCartButton
        listingId={listingId}
        title={title}
        price={price}
        images={images}
        shopId={shopId}
      />
    );
  }

  return (
    <div className="space-y-2">
      <Button className="w-full" size="lg" asChild>
        <Link
          href={`/dashboard/messages?userId=${sellerId}&listingId=${listingId}`}
        >
          <MessageCircle className="h-5 w-5" />
          Мукотиба кардан
        </Link>
      </Button>
      {phone && (
        <Button variant="outline" className="w-full" size="lg" asChild>
          <a href={`tel:${phone}`}>
            <Phone className="h-5 w-5" />
            Занг задан
          </a>
        </Button>
      )}
    </div>
  );
}
