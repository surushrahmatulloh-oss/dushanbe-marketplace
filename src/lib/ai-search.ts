import { prisma } from "@/lib/prisma";
import { expandSearchQuery, fuzzyMatch } from "@/lib/marketplace";

export interface AiSearchFilters {
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  keywords: string[];
  location: string | null;
  summary?: string | null;
}

const CACHE_TTL_MS = 1000 * 60 * 30;
const cache = new Map<string, { at: number; filters: AiSearchFilters }>();

const CATEGORY_HINTS: Record<string, string[]> = {
  moshin: ["мошин", "авто", "автомобил", "машина", "sedan", "suv", "toyota", "camry", "автомобиль", "car"],
  khona: ["хона", "квартира", "апартамент", "хонагӣ", "квартиру", "дом", "house", "apartment"],
  telefon: ["телефон", "мобил", "смартфон", "iphone", "samsung", "android", "phone", "мобильный"],
  libos: ["либос", "курта", "плош", "зимистон", "зимистонӣ", "тобистон", "одежда", "куртка", "clothes"],
  kudakona: ["кӯдак", "фарзанд", "кӯдакона", "baby", "ребенок", "детский", "kids"],
  mebel: ["мебел", "миз", "курсӣ", "диван", "мебель", "furniture"],
  kor: ["кор", "вакансия", "соат", "работа", "job"],
  khizmat: ["хизмат", "таъмир", "хизматрасонӣ", "услуга", "ремонт", "service"],
};

export async function getCategoryCatalog() {
  return prisma.category.findMany({
    select: { name: true, slug: true, parentId: true },
    orderBy: { name: "asc" },
  });
}

function buildSystemPrompt(
  categories: { name: string; slug: string; parentId: string | null }[]
) {
  const list = categories.map((c) => `- ${c.slug}: ${c.name}`).join("\n");
  return `Ту ёрдамчии ҷустуҷӯи маркетплейси "Душанбе Маркетплейс" ҳастӣ.
Матни вуруд метавонад ба забони тоҷикӣ, русӣ ё англлисӣ бошад — ҳамаи забонҳоро фаҳм, аммо summary-ро ба тоҷикӣ бинавис.
Валюта: сомонӣ (с.). Шаҳрҳои маъмул: Душанбе, Хуҷанд, Кулоб, Бохтар.

Категорияҳои дастрас (ТАНҲО як slug аз ин рӯйхат истифода бар, ё null):
${list}

Аз матни истифодабаранда параметрҳои ҷустуҷӯро барор.
ТАНҲО JSON бидеҳ, бе markdown, бе шарҳ:
{
  "category": string|null,
  "minPrice": number|null,
  "maxPrice": number|null,
  "keywords": string[],
  "location": string|null,
  "summary": string
}

summary — як ҷумлаи кӯтоҳ ба тоҷикӣ барои истифодабаранда (масalan: "Ман 12 либоси зимистонии кӯдакона то 200 сомонӣ ёфтам").`;
}

export function parseAiJson(text: string): AiSearchFilters {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as Partial<AiSearchFilters>;
  return {
    category: parsed.category ?? null,
    minPrice: typeof parsed.minPrice === "number" ? parsed.minPrice : null,
    maxPrice: typeof parsed.maxPrice === "number" ? parsed.maxPrice : null,
    keywords: Array.isArray(parsed.keywords)
      ? parsed.keywords.filter((k): k is string => typeof k === "string")
      : [],
    location: parsed.location ?? null,
    summary: parsed.summary ?? null,
  };
}

export async function callClaudeApi(
  query: string,
  categories: { name: string; slug: string; parentId: string | null }[]
): Promise<AiSearchFilters> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const cached = cache.get(query.toLowerCase());
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.filters;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: buildSystemPrompt(categories),
      messages: [{ role: "user", content: query }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error("Empty Claude response");

  const filters = parseAiJson(text);
  cache.set(query.toLowerCase(), { at: Date.now(), filters });
  return filters;
}

export function localFallbackParse(
  query: string,
  categories: { name: string; slug: string; parentId: string | null }[]
): AiSearchFilters {
  const lower = query.toLowerCase();
  const keywords = expandSearchQuery(query);

  let category: string | null = null;
  for (const [slug, hints] of Object.entries(CATEGORY_HINTS)) {
    if (hints.some((h) => lower.includes(h))) {
      category = slug;
      break;
    }
  }

  if (!category) {
    const matched = categories.find(
      (c) =>
        lower.includes(c.name.toLowerCase()) ||
        lower.includes(c.slug) ||
        keywords.some((k) => c.name.toLowerCase().includes(k))
    );
    category = matched?.slug ?? null;
  }

  const priceMatch = lower.match(/(\d[\d\s]*)\s*(?:сомон|сомонӣ|с\.)/);
  let maxPrice: number | null = null;
  let minPrice: number | null = null;

  if (priceMatch) {
    const value = parseInt(priceMatch[1].replace(/\s/g, ""), 10);
    if (lower.includes("то ") || lower.includes("аз ") || lower.includes("диапазон")) {
      maxPrice = value;
    } else if (lower.includes("аз ") && lower.indexOf("аз ") < lower.indexOf(priceMatch[0])) {
      minPrice = value;
    } else {
      maxPrice = value;
    }
  }

  if (lower.includes("арзон") && !maxPrice) maxPrice = 500;
  if (lower.includes("дешев") && !maxPrice) maxPrice = 500;
  if (lower.includes("cheap") && !maxPrice) maxPrice = 500;
  if (lower.includes("гарон") && !minPrice) minPrice = 1000;

  const locations = ["душанбе", "хujand", "хуҷанд", "кулоб", "марказ"];
  const location =
    locations.find((loc) => lower.includes(loc)) ??
    (lower.includes("марказ") ? "марказ" : null);

  return {
    category,
    minPrice,
    maxPrice,
    keywords: keywords.length > 0 ? keywords : [query.trim()],
    location,
    summary: null,
  };
}

export async function searchWithFilters(
  filters: AiSearchFilters,
  originalQuery: string
) {
  let categoryIds: string[] | undefined;

  if (filters.category) {
    const category = await prisma.category.findFirst({
      where: { slug: filters.category },
      include: { children: { select: { id: true } } },
    });
    if (category) {
      categoryIds = [category.id, ...category.children.map((c) => c.id)];
    }
  }

  const priceFilter: { gte?: number; lte?: number } = {};
  if (filters.minPrice != null) priceFilter.gte = filters.minPrice;
  if (filters.maxPrice != null) priceFilter.lte = filters.maxPrice;

  const listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      ...(categoryIds && { categoryId: { in: categoryIds } }),
      ...(Object.keys(priceFilter).length > 0 && { price: priceFilter }),
      ...(filters.location && {
        location: { contains: filters.location },
      }),
    },
    include: {
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const terms = [
    ...filters.keywords,
    ...expandSearchQuery(originalQuery),
  ].filter(Boolean);

  const filtered =
    terms.length > 0
      ? listings.filter(
          (l) =>
            terms.some(
              (t) =>
                fuzzyMatch(l.title, t) ||
                fuzzyMatch(l.description, t) ||
                fuzzyMatch(l.category.name, t)
            ) ||
            fuzzyMatch(l.title, originalQuery) ||
            fuzzyMatch(l.description, originalQuery)
        )
      : listings;

  const results = filtered.slice(0, 24);
  const summary =
    filters.summary ??
    buildSummary(results.length, filters, originalQuery);

  return { listings: results, summary };
}

function buildSummary(
  count: number,
  filters: AiSearchFilters,
  query: string
): string {
  const parts: string[] = [];
  if (count === 0) {
    return `Барои «${query}» эълон ёфт нашуд. Кӯшиш кунед дархостро тағир диҳед.`;
  }

  parts.push(`Ман ${count} эълон ёфтам`);
  if (filters.category) parts.push(`дар категорияи ${filters.category}`);
  if (filters.maxPrice != null) parts.push(`то ${filters.maxPrice.toLocaleString()} сомонӣ`);
  if (filters.location) parts.push(`дар ${filters.location}`);
  parts.push(".");
  return parts.join(" ");
}
