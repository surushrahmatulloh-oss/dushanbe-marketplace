import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoryList } from "@/components/categories/category-list";

export const metadata: Metadata = {
  title: "Категорияҳо",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      _count: { select: { listings: { where: { status: "ACTIVE" } } } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Категорияҳо</h1>
      <p className="text-muted-foreground mb-8">
        Интихоб кунед, ки чӣ ҷустуҷӯ мекунед
      </p>

      <CategoryList
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon: c.icon,
          count: c._count.listings,
        }))}
      />
    </div>
  );
}
