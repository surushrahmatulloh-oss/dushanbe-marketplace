"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { parseImages } from "@/lib/utils";
import { ShoppingCart, Zap } from "lucide-react";

interface AddToCartButtonProps {
  listingId: string;
  title: string;
  price: number;
  images: string;
  shopId?: string | null;
}

export function AddToCartButton({
  listingId,
  title,
  price,
  images,
  shopId,
}: AddToCartButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    if (!session) {
      router.push("/login?callbackUrl=/listing/" + listingId);
      return;
    }
    const imageList = parseImages(images);
    addItem({
      listingId,
      title,
      price,
      image: imageList[0] || "/placeholder.svg",
      shopId,
    });
  };

  return (
    <div className="space-y-2">
      <Button className="w-full" size="lg" onClick={handleAdd}>
        <ShoppingCart className="h-5 w-5" />
        Илова ба сабад
      </Button>
      <Button variant="accent" className="w-full" size="lg" onClick={handleAdd}>
        <Zap className="h-5 w-5" />
        Харидани ҳозира
      </Button>
    </div>
  );
}
