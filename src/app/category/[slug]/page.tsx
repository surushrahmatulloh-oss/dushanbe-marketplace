import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getCategoryAttributes,
  filterListingIdsByAttributes,
} from "@/lib/attribute-filters";
import { ListingCard } from "@/components/listings/listing-card";
import { CategoryFilters } from "@/components/listings/category-filters";

interface Props {
  params: { slug: string };
  searchParams: Record<string, string | undefined>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });
  return { title: category?.name || "Категория" };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: { children: true, parent: true },
  });

  if (!category) notFound();

  const attrCategoryId = category.parentId ?? category.id;
  const attributes = await getCategoryAttributes(category.id, category.parentId);

  const categoryIds = [category.id, ...category.children.map((c) => c.id)];

  const where: Record<string, unknown> = {
    status: "ACTIVE",
    categoryId: { in: categoryIds },
  };

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {};
    if (searchParams.minPrice)
      (where.price as Record<string, number>).gte = parseFloat(searchParams.minPrice);
    if (searchParams.maxPrice)
      (where.price as Record<string, number>).lte = parseFloat(searchParams.maxPrice);
  }
  if (searchParams.condition) where.condition = searchParams.condition;
  if (searchParams.location) where.location = { contains: searchParams.location };

  const attributeListingIds = await filterListingIdsByAttributes(
    attrCategoryId,
    searchParams
  );

  if (attributeListingIds !== undefined) {
    if (attributeListingIds.length === 0) {
      where.id = { in: [] };
    } else {
      where.id = { in: attributeListingIds };
    }
  }

  const orderBy =
    searchParams.sort === "price_asc"
      ? { price: "asc" as const }
      : searchParams.sort === "price_desc"
      ? { price: "desc" as const }
      : searchParams.sort === "popular"
      ? { views: "desc" as const }
      : { createdAt: "desc" as const };

  const listings = await prisma.listing.findMany({
    where,
    orderBy,
    take: 40,
  });

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        {category.parent && (
          <p className="text-sm text-muted-foreground mb-1">{category.parent.name}</p>
        )}
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-muted-foreground mt-1">{listings.length} эълон ёфт шуд</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 shrink-0">
          <CategoryFilters searchParams={searchParams} attributes={attributes} />
        </aside>
        <div className="flex-1">
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground mb-2">Эълон ёфт нашуд</p>
              <p className="text-sm text-muted-foreground">
                Филтрҳоро тағйир диҳед ё тоза кунед
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
