import Link from "next/link";
import { cn } from "@/lib/utils";

const TILE_ACCENT: Record<string, string> = {
  moshin: "#f97316",
  khona: "#fb7185",
  telefon: "#38bdf8",
  kor: "#60a5fa",
  libos: "#a78bfa",
  mebel: "#fbbf24",
  kudakona: "#f472b6",
  khizmat: "#2dd4bf",
  all: "#94a3b8",
};

function CategoryIllustration({ slug }: { slug: string }) {
  const color = TILE_ACCENT[slug] || "#60a5fa";

  switch (slug) {
    case "moshin":
      return (
        <svg viewBox="0 0 80 64" className="h-12 w-14" aria-hidden>
          <path d="M14 40h52l-4-14c-1-4-4-7-8-8H26c-4 1-7 4-8 8l-4 14z" fill={color} />
          <path d="M22 26h36l-2-6H24l-2 6z" fill="#fff" opacity="0.25" />
          <circle cx="24" cy="42" r="7" fill="#0f172a" />
          <circle cx="56" cy="42" r="7" fill="#0f172a" />
          <circle cx="24" cy="42" r="3" fill="#94a3b8" />
          <circle cx="56" cy="42" r="3" fill="#94a3b8" />
        </svg>
      );
    case "khona":
      return (
        <svg viewBox="0 0 80 64" className="h-12 w-14" aria-hidden>
          <path d="M12 34 L40 12 L68 34 V54 H12 Z" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <path d="M12 34 L40 12 L68 34" fill={color} />
          <rect x="34" y="38" width="12" height="16" rx="1" fill={color} />
          <rect x="20" y="36" width="10" height="10" rx="1" fill="#bae6fd" />
          <rect x="50" y="36" width="10" height="10" rx="1" fill="#bae6fd" />
        </svg>
      );
    case "telefon":
      return (
        <svg viewBox="0 0 80 64" className="h-12 w-14" aria-hidden>
          <rect x="28" y="6" width="24" height="48" rx="5" fill={color} />
          <rect x="31" y="12" width="18" height="32" rx="2" fill="#ecfeff" />
          <circle cx="40" cy="48" r="2.5" fill="#fff" opacity="0.9" />
        </svg>
      );
    case "kor":
      return (
        <svg viewBox="0 0 80 64" className="h-12 w-14" aria-hidden>
          <rect x="16" y="24" width="48" height="28" rx="4" fill={color} />
          <path d="M30 24 V18 a4 4 0 0 1 4-4 h12 a4 4 0 0 1 4 4 v6" fill="none" stroke="#1e3a8a" strokeWidth="3" />
          <rect x="34" y="34" width="12" height="8" rx="2" fill="#93c5fd" />
        </svg>
      );
    case "libos":
      return (
        <svg viewBox="0 0 80 64" className="h-12 w-14" aria-hidden>
          <path d="M28 14 L20 22 L26 28 V54 H54 V28 L60 22 L52 14 L40 22 Z" fill={color} />
        </svg>
      );
    case "mebel":
      return (
        <svg viewBox="0 0 80 64" className="h-12 w-14" aria-hidden>
          <rect x="14" y="28" width="52" height="20" rx="5" fill={color} />
          <rect x="18" y="20" width="18" height="12" rx="3" fill="#fcd34d" />
          <rect x="44" y="20" width="18" height="12" rx="3" fill="#fcd34d" />
        </svg>
      );
    case "kudakona":
      return (
        <svg viewBox="0 0 80 64" className="h-12 w-14" aria-hidden>
          <circle cx="40" cy="20" r="11" fill="#fce7f3" />
          <path d="M28 36 Q40 56 52 36" fill={color} />
        </svg>
      );
    case "khizmat":
      return (
        <svg viewBox="0 0 80 64" className="h-12 w-14" aria-hidden>
          <path
            d="M48 12a12 12 0 0 0-14 14l-16 16a5 5 0 0 0 7 7l16-16a12 12 0 0 0 14-14l-8 4-3-3 4-8z"
            fill={color}
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 80 64" className="h-12 w-14" aria-hidden>
          <g fill={color}>
            {[0, 1, 2].flatMap((row) =>
              [0, 1, 2].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={18 + col * 18}
                  y={12 + row * 16}
                  width="12"
                  height="12"
                  rx="2.5"
                  opacity={0.5 + ((row + col) % 3) * 0.2}
                />
              ))
            )}
          </g>
        </svg>
      );
  }
}

export interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  count?: number;
}

const SHORT_NAMES: Record<string, string> = {
  moshin: "Нақлиёт",
  khona: "Амволи ғайриманқул",
  telefon: "Телефонҳо ва алоқа",
  kor: "Ҷои кор",
  libos: "Либос",
  mebel: "Мебел",
  kudakona: "Кӯдакона",
  khizmat: "Хизматрасонӣ",
};

const DISPLAY_ORDER = ["moshin", "khona", "telefon", "kor", "libos", "mebel", "kudakona", "khizmat"];

export function CategoryCard({ name, slug }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className={cn(
        "group flex flex-col items-center justify-center gap-2",
        "rounded-2xl bg-white border border-border/80 p-3 min-h-[108px] sm:min-h-[120px]",
        "shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md active:scale-[0.97]"
      )}
    >
      <div className="flex h-12 w-14 items-center justify-center transition-transform group-hover:scale-110">
        <CategoryIllustration slug={slug} />
      </div>
      <p className="text-center text-[11px] sm:text-xs font-medium leading-tight text-foreground/90 line-clamp-2 px-0.5">
        {name}
      </p>
    </Link>
  );
}

interface CategoryGridProps {
  categories: CategoryCardProps[];
  className?: string;
  somonStyle?: boolean;
}

export function CategoryGrid({
  categories,
  className,
  somonStyle = true,
}: CategoryGridProps) {
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const featured = DISPLAY_ORDER.map((slug) => bySlug[slug])
    .filter(Boolean)
    .slice(0, somonStyle ? 5 : 8);

  const tiles = somonStyle
    ? [
        ...featured.map((c) => ({ ...c, name: SHORT_NAMES[c.slug] || c.name })),
        { id: "all", name: "Ҳама бандҳо", slug: "all", icon: "all" },
      ]
    : categories.map((c) => ({ ...c, name: SHORT_NAMES[c.slug] || c.name }));

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {tiles.map((cat) =>
        cat.slug === "all" ? (
          <Link
            key="all"
            href="/categories"
            className={cn(
              "group flex flex-col items-center justify-center gap-2",
              "rounded-2xl bg-white border border-border/80 p-3 min-h-[108px] sm:min-h-[120px]",
              "shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md active:scale-[0.97]"
            )}
          >
            <div className="flex h-12 w-14 items-center justify-center transition-transform group-hover:scale-110">
              <CategoryIllustration slug="all" />
            </div>
            <p className="text-center text-[11px] sm:text-xs font-medium leading-tight">
              Ҳама бандҳо
            </p>
          </Link>
        ) : (
          <CategoryCard key={cat.id} {...cat} />
        )
      )}
    </div>
  );
}
