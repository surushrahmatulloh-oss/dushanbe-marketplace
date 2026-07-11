import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Eye, Heart, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [listingsCount, totalViews, favoritesCount] = await Promise.all([
    prisma.listing.count({ where: { userId } }),
    prisma.listing.aggregate({
      where: { userId },
      _sum: { views: true },
    }),
    prisma.favorite.count({ where: { userId } }),
  ]);

  const recentListings = await prisma.listing.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Эълонҳо", value: listingsCount, icon: Package },
    { label: "Намоишҳо", value: totalViews._sum.views || 0, icon: Eye },
    { label: "Дӯстдоштаҳо", value: favoritesCount, icon: Heart },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Хуш омадед, {session!.user!.name}!</h2>
        <Link href="/sell">
          <Button variant="accent" size="sm">
            <Plus className="h-4 w-4" />
            Эълон нав
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Эълонҳои охирин</CardTitle>
        </CardHeader>
        <CardContent>
          {recentListings.length > 0 ? (
            <div className="space-y-3">
              {recentListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{listing.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {listing.status} · {listing.views} намоиш
                    </p>
                  </div>
                  <p className="font-bold text-primary">{listing.price} с.</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Шумо ҳанӯз эълон надоред</p>
              <Link href="/sell">
                <Button>Аввалин эълонро гузоред</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
