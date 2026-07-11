import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CategoryGrid } from "@/components/home/category-grid";

export const metadata: Metadata = {
  title: "Категорияҳо",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: true,
      _count: { select: { listings: { where: { status: "ACTIVE" } } } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Категорияҳо</h1>
      <p className="text-muted-foreground mb-8">
        Интихоб кунед, ки чӣ ҷустуҷӯ мекунед
      </p>

      <CategoryGrid
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon: c.icon,
          count: c._count.listings,
        }))}
        className="mb-12"
      />

      {categories.map((cat) =>
        cat.children.length > 0 ? (
          <div key={cat.id} className="mb-10">
            <h2 className="text-xl font-semibold mb-4">{cat.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {cat.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/category/${child.slug}`}
                  className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <p className="font-medium">{child.name}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
