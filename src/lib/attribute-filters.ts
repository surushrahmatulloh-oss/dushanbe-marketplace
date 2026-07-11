import { prisma } from "@/lib/prisma";

export interface CategoryAttributeDef {
  id: string;
  name: string;
  slug: string;
  type: string;
  options: string[];
}

export function parseAttributeOptions(options: string): string[] {
  try {
    const parsed = JSON.parse(options);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getCategoryAttributes(
  categoryId: string,
  parentId: string | null
): Promise<CategoryAttributeDef[]> {
  const attrCategoryId = parentId ?? categoryId;
  const attributes = await prisma.categoryAttribute.findMany({
    where: { categoryId: attrCategoryId },
    orderBy: { order: "asc" },
  });

  return attributes.map((a) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    type: a.type,
    options: parseAttributeOptions(a.options),
  }));
}

export async function filterListingIdsByAttributes(
  attrCategoryId: string,
  searchParams: Record<string, string | undefined>
): Promise<string[] | undefined> {
  const attributes = await prisma.categoryAttribute.findMany({
    where: { categoryId: attrCategoryId },
  });

  if (attributes.length === 0) return undefined;

  let listingIds: Set<string> | null = null;

  const intersect = (ids: string[]) => {
    const set = new Set(ids);
    if (listingIds === null) {
      listingIds = set;
    } else {
      listingIds = new Set(Array.from(listingIds).filter((id) => set.has(id)));
    }
  };

  for (const attr of attributes) {
    if (attr.type === "SELECT" || attr.type === "TEXT") {
      const val = searchParams[`attr_${attr.slug}`];
      if (!val) continue;

      const matches = await prisma.listingAttributeValue.findMany({
        where: { attributeId: attr.id, value: val },
        select: { listingId: true },
      });
      intersect(matches.map((m) => m.listingId));
    } else if (attr.type === "NUMBER") {
      const min = searchParams[`attr_${attr.slug}_min`];
      const max = searchParams[`attr_${attr.slug}_max`];
      if (!min && !max) continue;

      const allValues = await prisma.listingAttributeValue.findMany({
        where: { attributeId: attr.id },
        select: { listingId: true, value: true },
      });

      const matched = allValues
        .filter((v) => {
          const num = parseFloat(v.value);
          if (isNaN(num)) return false;
          if (min && num < parseFloat(min)) return false;
          if (max && num > parseFloat(max)) return false;
          return true;
        })
        .map((v) => v.listingId);

      intersect(matched);
    }
  }

  if (listingIds === null) return undefined;
  return Array.from(listingIds);
}

export async function saveListingAttributes(
  listingId: string,
  categoryId: string,
  attributes: Record<string, string>
) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, parentId: true },
  });
  if (!category) return;

  const attrCategoryId = category.parentId ?? category.id;
  const defs = await prisma.categoryAttribute.findMany({
    where: { categoryId: attrCategoryId },
  });

  for (const def of defs) {
    const value = attributes[def.slug]?.trim();
    if (!value) continue;

    await prisma.listingAttributeValue.upsert({
      where: {
        listingId_attributeId: { listingId, attributeId: def.id },
      },
      update: { value },
      create: { listingId, attributeId: def.id, value },
    });
  }
}
