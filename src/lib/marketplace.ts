const SYNONYMS: Record<string, string[]> = {
  телефон: ["мобил", "смартфон", "phone", "iphone", "samsung"],
  мобил: ["телефон", "смартфон"],
  смартфон: ["телефон", "мобил"],
  мошин: ["авто", "автомобил", "car"],
  авто: ["мошин", "автомобил"],
  хона: ["квартира", "апартамент"],
  квартира: ["хона", "апартамент"],
  ноутбук: ["laptop", "macbook", "компютер"],
};

export function expandSearchQuery(query: string): string[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const terms = new Set<string>([normalized]);
  const words = normalized.split(/\s+/);

  for (const word of words) {
    terms.add(word);
    const syns = SYNONYMS[word];
    if (syns) syns.forEach((s) => terms.add(s));
  }

  return Array.from(terms);
}

export function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return true;
  if (t.includes(q)) return true;

  // Simple typo tolerance: allow 1 char difference for short queries
  if (q.length >= 4) {
    for (let i = 0; i <= t.length - q.length; i++) {
      const slice = t.slice(i, i + q.length);
      let diff = 0;
      for (let j = 0; j < q.length; j++) {
        if (slice[j] !== q[j]) diff++;
        if (diff > 1) break;
      }
      if (diff <= 1) return true;
    }
  }

  return expandSearchQuery(q).some((term) => t.includes(term));
}

export const TRENDING_SEARCHES = [
  "iPhone",
  "Toyota",
  "Квартира",
  "Samsung",
  "MacBook",
  "Мебел",
];

export const ORDER_STATUSES = [
  { key: "PENDING", label: "Қабул шуд" },
  { key: "CONFIRMED", label: "Тасдиқ шуд" },
  { key: "PROCESSING", label: "Омодасозӣ" },
  { key: "SHIPPED", label: "Супорида шуд" },
  { key: "IN_TRANSIT", label: "Дар роҳ" },
  { key: "DELIVERED", label: "Расонида шуд" },
  { key: "CANCELLED", label: "Бекор шуд" },
  { key: "RETURNED", label: "Бозгардонӣ" },
] as const;

export function getOrderStatusLabel(status: string): string {
  return ORDER_STATUSES.find((s) => s.key === status)?.label ?? status;
}

export function parseStatusHistory(history: string): { status: string; at: string }[] {
  try {
    const parsed = JSON.parse(history);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
