"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SomonSearchBar({
  listingCount = 0,
  className,
}: {
  listingCount?: number;
  className?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const go = () => {
    const query = q.trim();
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
    else router.push("/search");
  };

  const countLabel =
    listingCount > 0
      ? listingCount.toLocaleString("tg-TJ")
      : "ҳазорҳо";

  return (
    <div className={cn("px-4", className)}>
      <div
          className={cn(
            "flex items-center gap-2 rounded-full bg-white border border-border px-4 h-11",
            "shadow-sm"
          )}
      >
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder={`Ҷустуҷӯ аз ${countLabel} эълон`}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
