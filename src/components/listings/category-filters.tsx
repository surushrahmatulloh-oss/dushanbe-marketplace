"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryAttributeDef } from "@/lib/attribute-filters";

interface CategoryFiltersProps {
  searchParams: Record<string, string | undefined>;
  attributes?: CategoryAttributeDef[];
}

const BASE_KEYS = ["minPrice", "maxPrice", "condition", "sort", "location"];

export function CategoryFilters({ searchParams, attributes = [] }: CategoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const applyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newParams = new URLSearchParams(params.toString());

    [...BASE_KEYS, ...getAttributeKeys(attributes)].forEach((key) => {
      const value = formData.get(key) as string;
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });

    router.push(`${pathname}?${newParams.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = Object.entries(searchParams).some(
    ([k, v]) => v && (BASE_KEYS.includes(k) || k.startsWith("attr_"))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Филтрҳо</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={applyFilters} className="space-y-4">
          {attributes.length > 0 && (
            <div className="space-y-4 pb-4 border-b border-border">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Филтри категория
              </p>
              {attributes.map((attr) => (
                <AttributeField
                  key={attr.id}
                  attr={attr}
                  searchParams={searchParams}
                />
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="minPrice">Нарх аз (сомонӣ)</Label>
            <Input
              id="minPrice"
              name="minPrice"
              type="number"
              placeholder="0"
              defaultValue={searchParams.minPrice}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPrice">Нарх то (сомонӣ)</Label>
            <Input
              id="maxPrice"
              name="maxPrice"
              type="number"
              placeholder="500000"
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

          <Button type="submit" className="w-full">
            Татбиқ
          </Button>
          {hasActiveFilters && (
            <Button type="button" variant="outline" className="w-full" onClick={clearFilters}>
              Тоза кардан
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function AttributeField({
  attr,
  searchParams,
}: {
  attr: CategoryAttributeDef;
  searchParams: Record<string, string | undefined>;
}) {
  if (attr.type === "SELECT") {
    return (
      <div className="space-y-2">
        <Label htmlFor={`attr_${attr.slug}`}>{attr.name}</Label>
        <select
          id={`attr_${attr.slug}`}
          name={`attr_${attr.slug}`}
          defaultValue={searchParams[`attr_${attr.slug}`] || ""}
          className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
        >
          <option value="">Ҳама</option>
          {attr.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (attr.type === "NUMBER") {
    return (
      <div className="space-y-2">
        <Label>{attr.name}</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            name={`attr_${attr.slug}_min`}
            type="number"
            placeholder="Аз"
            defaultValue={searchParams[`attr_${attr.slug}_min`]}
          />
          <Input
            name={`attr_${attr.slug}_max`}
            type="number"
            placeholder="То"
            defaultValue={searchParams[`attr_${attr.slug}_max`]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`attr_${attr.slug}`}>{attr.name}</Label>
      <Input
        id={`attr_${attr.slug}`}
        name={`attr_${attr.slug}`}
        placeholder={attr.name}
        defaultValue={searchParams[`attr_${attr.slug}`]}
      />
    </div>
  );
}

function getAttributeKeys(attributes: CategoryAttributeDef[]): string[] {
  const keys: string[] = [];
  for (const attr of attributes) {
    if (attr.type === "NUMBER") {
      keys.push(`attr_${attr.slug}_min`, `attr_${attr.slug}_max`);
    } else {
      keys.push(`attr_${attr.slug}`);
    }
  }
  return keys;
}
