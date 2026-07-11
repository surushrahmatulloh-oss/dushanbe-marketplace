"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Сабад холӣ аст</h1>
        <p className="text-muted-foreground mb-6">Маҳсулот илова кунед</p>
        <Link href="/">
          <Button>Ба харид гузаштан</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-8">Сабади харид</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.listingId}
              className="flex gap-4 rounded-2xl border border-border p-4"
            >
              <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-muted">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/listing/${item.listingId}`}
                  className="font-medium hover:text-primary line-clamp-2"
                >
                  {item.title}
                </Link>
                <p className="text-lg font-bold text-primary mt-1">
                  {formatPrice(item.price)}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2 rounded-lg border border-border">
                    <button
                      onClick={() => updateQuantity(item.listingId, item.quantity - 1)}
                      className="p-1.5 hover:bg-muted rounded-l-lg"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.listingId, item.quantity + 1)}
                      className="p-1.5 hover:bg-muted rounded-r-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.listingId)}
                    className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border p-6 h-fit sticky top-20">
          <h2 className="font-bold text-lg mb-4">Ҷамъ</h2>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-muted-foreground">Маҳсулот</span>
            <span>{formatPrice(total())}</span>
          </div>
          <div className="border-t border-border pt-4 mt-4 flex justify-between font-bold text-lg">
            <span>Умумӣ</span>
            <span className="text-primary">{formatPrice(total())}</span>
          </div>
          <Button
            className="w-full mt-6"
            size="lg"
            onClick={() => router.push("/checkout")}
          >
            Ба фармоиш гузаштан
          </Button>
        </div>
      </div>
    </div>
  );
}
