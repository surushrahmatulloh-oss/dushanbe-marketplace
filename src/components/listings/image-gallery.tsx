"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const imageList = images.length > 0 ? images : ["/placeholder.svg"];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
        <Image
          src={imageList[current]}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
        />
        {imageList.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm"
              onClick={() => setCurrent((p) => (p - 1 + imageList.length) % imageList.length)}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm"
              onClick={() => setCurrent((p) => (p + 1) % imageList.length)}
            >
              <ChevronRight />
            </Button>
          </>
        )}
      </div>
      {imageList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imageList.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                i === current ? "border-primary" : "border-transparent"
              )}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
