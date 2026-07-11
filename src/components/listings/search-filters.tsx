"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchFiltersProps {
  searchParams: Record<string, string | undefined>;
}

export function SearchFilters({ searchParams }: SearchFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();

  const applyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newParams = new URLSearchParams(params.toString());

    ["minPrice", "maxPrice", "condition", "sort", "location"].forEach((key) => {
      const value = formData.get(key) as string;
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });

    router.push(`?${newParams.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Филтрҳо</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={applyFilters} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="minPrice">Нарх аз</Label>
            <Input
              id="minPrice"
              name="minPrice"
              type="number"
              placeholder="0"
              defaultValue={searchParams.minPrice}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPrice">Нарх то</Label>
            <Input
              id="maxPrice"
              name="maxPrice"
              type="number"
              placeholder="100000"
              defaultValue={searchParams.maxPrice}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition">Ҳолат</Label>
            <select
              id="condition"
              name="condition"
              defaultValue={searchParams.condition || ""}
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
            >
              <option value="">Ҳама</option>
              <option value="NEW">Нав</option>
              <option value="USED">Истифодашуда</option>
              <option value="REFURBISHED">Таҷдидшуда</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Ҷойгиршавӣ</Label>
            <Input
              id="location"
              name="location"
              placeholder="Душанбе"
              defaultValue={searchParams.location}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort">Ҷобаҷокунӣ</Label>
            <select
              id="sort"
              name="sort"
              defaultValue={searchParams.sort || "newest"}
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
            >
              <option value="newest">Навтарин</option>
              <option value="price_asc">Арзонтарин</option>
              <option value="price_desc">Қиматтарин</option>
              <option value="popular">Машҳуртарин</option>
            </select>
          </div>
          <Button type="submit" className="w-full">Татбиқ</Button>
        </form>
      </CardContent>
    </Card>
  );
}
