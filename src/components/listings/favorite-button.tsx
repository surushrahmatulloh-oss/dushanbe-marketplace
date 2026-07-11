"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  listingId: string;
}

export function FavoriteButton({ listingId }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!session) return null;

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      setFavorited(data.favorited);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      disabled={loading}
      aria-label="Дӯстдошта"
    >
      <Heart className={cn("h-5 w-5", favorited && "fill-red-500 text-red-500")} />
    </Button>
  );
}
