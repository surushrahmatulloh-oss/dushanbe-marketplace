"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link?: string | null;
}

interface HeroSliderProps {
  banners: Banner[];
}

export function HeroSlider({ banners }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary/70">
        <div className="absolute inset-0 flex flex-col items-start justify-center px-8 sm:px-12 text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold max-w-lg leading-tight">
            Хариду фурӯш дар як платформа
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-md">
            Эълонҳои шахсӣ ва мағозаҳои онлайн — ҳама дар Душанбе Маркетплейс
          </p>
          <Link href="/sell" className="mt-6">
            <Button variant="accent" size="lg">
              Оғози фурӯш
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const banner = banners[current];

  return (
    <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] rounded-3xl overflow-hidden group">
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={b.image}
            alt={b.title}
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-start justify-center px-8 sm:px-12 text-white z-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold max-w-lg leading-tight">
          {banner.title}
        </h1>
        {banner.subtitle && (
          <p className="mt-4 text-lg text-white/80 max-w-md">{banner.subtitle}</p>
        )}
        {banner.link && (
          <Link href={banner.link} className="mt-6">
            <Button variant="accent" size="lg">Муфассал</Button>
          </Link>
        )}
      </div>

      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm text-white hover:bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm text-white hover:bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
          >
            <ChevronRight />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === current ? "w-6 bg-white" : "w-2 bg-white/50"
                )}
                onClick={() => setCurrent(i)}
                aria-label={`Слайд ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
