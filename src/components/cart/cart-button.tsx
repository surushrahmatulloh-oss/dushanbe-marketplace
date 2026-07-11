"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";

export function CartButton() {
  const count = useCartStore((s) => s.count());

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative" aria-label="Сабад">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Button>
    </Link>
  );
}
