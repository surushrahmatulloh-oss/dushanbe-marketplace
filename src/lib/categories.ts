/** Top-level marketplace categories (Somon-style full directory). */
export type TopCategoryDef = {
  name: string;
  slug: string;
  /** Lucide-style key stored in DB; UI uses emoji map */
  icon: string;
  emoji: string;
  /** Soft background for icon tile */
  tint: string;
};

export const TOP_CATEGORIES: TopCategoryDef[] = [
  {
    name: "Амволи ғайриманқул",
    slug: "khona",
    icon: "home",
    emoji: "🏠",
    tint: "bg-rose-50",
  },
  {
    name: "Нақлиёт",
    slug: "moshin",
    icon: "car",
    emoji: "🚗",
    tint: "bg-orange-50",
  },
  {
    name: "Компютерҳо",
    slug: "komputer",
    icon: "laptop",
    emoji: "💻",
    tint: "bg-sky-50",
  },
  {
    name: "Телефонҳо ва алоқа",
    slug: "telefon",
    icon: "smartphone",
    emoji: "📱",
    tint: "bg-cyan-50",
  },
  {
    name: "Электроника",
    slug: "elektronika",
    icon: "cpu",
    emoji: "🔌",
    tint: "bg-violet-50",
  },
  {
    name: "Барои манзил",
    slug: "mebel",
    icon: "sofa",
    emoji: "🛋️",
    tint: "bg-amber-50",
  },
  {
    name: "Хизматрасониҳо",
    slug: "khizmat",
    icon: "wrench",
    emoji: "🔧",
    tint: "bg-teal-50",
  },
  {
    name: "Ҳайвонот",
    slug: "hayvonot",
    icon: "paw",
    emoji: "🐾",
    tint: "bg-lime-50",
  },
  {
    name: "Шавку завқ",
    slug: "shavq",
    icon: "palette",
    emoji: "🎨",
    tint: "bg-fuchsia-50",
  },
  {
    name: "Либос ва пойафзол",
    slug: "libos",
    icon: "shirt",
    emoji: "👕",
    tint: "bg-indigo-50",
  },
  {
    name: "Кӯдакона",
    slug: "kudakona",
    icon: "baby",
    emoji: "🧸",
    tint: "bg-pink-50",
  },
  {
    name: "Ҷои кор",
    slug: "kor",
    icon: "briefcase",
    emoji: "💼",
    tint: "bg-blue-50",
  },
  {
    name: "Варзиш ва истироҳат",
    slug: "sport",
    icon: "dumbbell",
    emoji: "⚽",
    tint: "bg-emerald-50",
  },
  {
    name: "Зебоӣ ва саломатӣ",
    slug: "gozallik",
    icon: "heart",
    emoji: "💄",
    tint: "bg-red-50",
  },
  {
    name: "Тиҷорат ва таҷҳизот",
    slug: "tijorat",
    icon: "store",
    emoji: "🏪",
    tint: "bg-slate-100",
  },
];

export const CATEGORY_BY_SLUG = Object.fromEntries(
  TOP_CATEGORIES.map((c) => [c.slug, c])
);

export function categoryEmoji(slug: string, fallbackIcon?: string | null) {
  return CATEGORY_BY_SLUG[slug]?.emoji || fallbackIcon || "📦";
}

export function categoryTint(slug: string) {
  return CATEGORY_BY_SLUG[slug]?.tint || "bg-slate-50";
}
