"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteListingButtonProps {
  listingId: string;
}

export function DeleteListingButton({ listingId }: DeleteListingButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Мутмаин ҳастед, ки мехоҳед ин эълонро нест кунед?")) return;

    await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} aria-label="Нест кардан">
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
