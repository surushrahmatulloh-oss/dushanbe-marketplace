import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Eye, Calendar } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, parseImages } from "@/lib/utils";
import { recordView, getAlsoViewed } from "@/lib/recommendations";
import { ImageGallery } from "@/components/listings/image-gallery";
import { FavoriteButton } from "@/components/listings/favorite-button";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingActions } from "@/components/listings/listing-actions";
import { ReviewsSection } from "@/components/listings/reviews-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    select: { title: true, description: true, images: true },
  });
  if (!listing) return { title: "Эълон ёфт нашуд" };

  const images = parseImages(listing.images);
  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
    openGraph: images[0] ? { images: [images[0]] } : undefined,
  };
}

export const dynamic = "force-dynamic";

export default async function ListingPage({ params }: Props) {
  const session = await auth();

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      user: { select: { id: true, name: true, avatar: true, phone: true, createdAt: true } },
      shop: true,
      attributeValues: { include: { attribute: true } },
    },
  });

  if (!listing || listing.status !== "ACTIVE") notFound();

  await recordView(params.id, session?.user?.id);

  const [alsoViewed, reviews] = await Promise.all([
    getAlsoViewed(params.id, 4),
    prisma.review.findMany({
      where: { listingId: params.id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const images = parseImages(listing.images);
  const isOwner = session?.user?.id === listing.userId;

  const conditionLabel =
    listing.condition === "NEW"
      ? "Нав"
      : listing.condition === "USED"
      ? "Истифодашуда"
      : "Таҷдидшуда";

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={images} title={listing.title} />

          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{listing.category.name}</Badge>
                  <Badge variant="outline">{conditionLabel}</Badge>
                  {listing.type === "PRODUCT" && (
                    <Badge variant="accent">Мағоза</Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">{listing.title}</h1>
              </div>
              <FavoriteButton listingId={listing.id} />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              {listing.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {listing.views} намоиш
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(listing.createdAt)}
              </span>
            </div>

            <div className="prose prose-sm max-w-none">
              <h2 className="text-lg font-semibold mb-2">Тавсиф</h2>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {listing.description}
              </p>
            </div>

            {listing.attributeValues.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Хусусиятҳо</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {listing.attributeValues.map((av) => (
                    <div
                      key={av.id}
                      className="flex justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm"
                    >
                      <span className="text-muted-foreground">{av.attribute.name}</span>
                      <span className="font-medium">{av.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ReviewsSection
              listingId={listing.id}
              initialReviews={reviews}
              isOwner={isOwner}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-4">
              <p className="text-3xl font-bold text-primary">
                {formatPrice(listing.price)}
              </p>
              <ListingActions
                listingId={listing.id}
                title={listing.title}
                price={listing.price}
                images={listing.images}
                shopId={listing.shopId}
                type={listing.type}
                sellerId={listing.user.id}
                phone={listing.user.phone}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Фурӯшанда</h3>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {listing.user.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-medium">{listing.user.name || "Истифодабаранда"}</p>
                  {listing.shop && (
                    <p className="text-xs text-primary">
                      ★ {listing.shop.rating} · {listing.shop.reviewCount} шарҳ
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Аз {formatDate(listing.user.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {alsoViewed.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">Инро низ диданд</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {alsoViewed.map((item) => (
              <ListingCard key={item.id} {...item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
