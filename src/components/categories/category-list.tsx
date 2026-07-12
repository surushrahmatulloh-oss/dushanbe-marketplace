import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CATEGORY_BY_SLUG,
  TOP_CATEGORIES,
  categoryEmoji,
  categoryTint,
} from "@/lib/categories";

export type CategoryListItem = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  count?: number;
};

type CategoryListProps = {
  categories: CategoryListItem[];
  className?: string;
};

function sortLikeSomon(categories: CategoryListItem[]) {
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const ordered: CategoryListItem[] = [];

  for (const def of TOP_CATEGORIES) {
    const row = bySlug[def.slug];
    if (row) {
      ordered.push({
        ...row,
        name: CATEGORY_BY_SLUG[def.slug]?.name || row.name,
      });
      delete bySlug[def.slug];
    }
  }

  // Any extra top-level categories from DB
  const rest = Object.values(bySlug).sort((a, b) =>
    a.name.localeCompare(b.name, "tg")
  );
  return [...ordered, ...rest];
}

export function CategoryList({ categories, className }: CategoryListProps) {
  const rows = sortLikeSomon(categories);

  return (
    <nav
      aria-label="Категорияҳо"
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm",
        className
      )}
    >
      <ul className="divide-y divide-border/70">
        {rows.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/category/${cat.slug}`}
              className={cn(
                "group flex w-full items-center gap-4 px-4 py-3.5 sm:px-5 sm:py-4",
                "transition-colors hover:bg-slate-50/90 active:bg-slate-100/80"
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl",
                  "ring-1 ring-black/[0.04]",
                  categoryTint(cat.slug)
                )}
                aria-hidden
              >
                {categoryEmoji(cat.slug, cat.icon)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  {cat.name}
                </span>
                {typeof cat.count === "number" && cat.count > 0 ? (
                  <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">
                    {cat.count.toLocaleString("tg-TJ")} эълон
                  </span>
                ) : null}
              </span>

              <ChevronRight
                className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
