"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Story {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link?: string | null;
}

export function StoriesRow({ stories }: { stories: Story[] }) {
  if (stories.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-3">
      {stories.map((story) => {
        const inner = (
          <div
            className={cn(
              "relative h-[140px] w-[110px] sm:h-[160px] sm:w-[120px] shrink-0 overflow-hidden rounded-2xl",
              "ring-2 ring-primary/50 ring-offset-2 ring-offset-background shadow-sm"
            )}
          >
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="object-cover"
              sizes="120px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <p className="absolute bottom-2 left-2 right-2 text-[11px] font-medium text-white line-clamp-2 leading-tight">
              {story.title}
            </p>
          </div>
        );

        return story.link ? (
          <Link key={story.id} href={story.link}>
            {inner}
          </Link>
        ) : (
          <div key={story.id}>{inner}</div>
        );
      })}
    </div>
  );
}
