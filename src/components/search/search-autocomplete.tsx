"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Suggestion {
  id: string;
  title: string;
  price: number;
  category: string;
}

interface CategorySuggestion {
  name: string;
  slug: string;
}

export function SearchAutocomplete({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [listings, setListings] = useState<Suggestion[]>([]);
  const [categories, setCategories] = useState<CategorySuggestion[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setListings([]);
      setCategories([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setListings(data.listings || []);
      setCategories(data.categories || []);
      setTrending(data.trending || []);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const goSearch = (q: string) => {
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Ҷустуҷӯи маҳсулот, эълонҳо..."
          className="pl-10 rounded-full bg-muted/50 border-transparent focus:bg-background"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && query.trim() && goSearch(query)}
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden">
          {query.length < 2 && trending.length > 0 && (
            <div className="p-3">
              <p className="text-xs text-muted-foreground mb-2 px-2">Маъмул:</p>
              <div className="flex flex-wrap gap-2">
                {trending.map((t) => (
                  <button
                    key={t}
                    onClick={() => goSearch(t)}
                    className="rounded-full bg-muted px-3 py-1 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {categories.length > 0 && (
            <div className="border-t border-border p-2">
              <p className="text-xs text-muted-foreground px-2 py-1">Категорияҳо</p>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => {
                    setOpen(false);
                    router.push(`/category/${c.slug}`);
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {listings.length > 0 && (
            <div className="border-t border-border p-2">
              <p className="text-xs text-muted-foreground px-2 py-1">Маҳсулот</p>
              {listings.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setOpen(false);
                    router.push(`/listing/${l.id}`);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="text-sm font-medium line-clamp-1">{l.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.category} · {l.price.toLocaleString()} с.
                  </p>
                </button>
              ))}
              <button
                onClick={() => goSearch(query)}
                className="w-full text-center py-2 text-sm text-primary hover:underline"
              >
                Ҳамаи натиҷаҳо барои «{query}»
              </button>
            </div>
          )}

          {query.length >= 2 && listings.length === 0 && categories.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground text-center">Натиҷа нест</p>
          )}
        </div>
      )}
    </div>
  );
}
