"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  isVerifiedPurchase: boolean;
  sellerReply?: string | null;
  createdAt: string | Date;
  user: { name: string | null };
}

interface ReviewsSectionProps {
  listingId: string;
  initialReviews: Review[];
  isOwner?: boolean;
}

export function ReviewsSection({
  listingId,
  initialReviews,
  isOwner,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered = filter
    ? reviews.filter((r) => r.rating === filter)
    : reviews;

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  const submitReview = async () => {
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, rating, comment }),
    });
    if (res.ok) {
      const review = await res.json();
      setReviews([review, ...reviews]);
      setComment("");
    }
    setLoading(false);
  };

  const submitReply = async (reviewId: string) => {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sellerReply: replyText }),
    });
    if (res.ok) {
      const updated = await res.json();
      setReviews(reviews.map((r) => (r.id === reviewId ? updated : r)));
      setReplyId(null);
      setReplyText("");
    }
  };

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Шарҳҳо</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "h-4 w-4",
                      s <= Math.round(avg)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avg.toFixed(1)} · {reviews.length} шарҳ
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          {[null, 5, 4, 3, 2, 1].map((f) => (
            <button
              key={String(f)}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-2 py-1 text-xs transition-colors",
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted"
              )}
            >
              {f ? `${f}★` : "Ҳама"}
            </button>
          ))}
        </div>
      </div>

      {!isOwner && (
        <div className="rounded-2xl border border-border p-4 mb-6 space-y-3">
          <p className="font-medium text-sm">Баҳо гузоред</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)}>
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    s <= rating ? "fill-amber-400 text-amber-400" : "text-muted"
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Шарҳи шумо..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <Button onClick={submitReview} disabled={loading} size="sm">
            {loading ? "Мефиристем..." : "Фиристодан"}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((review) => (
          <div key={review.id} className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {review.user.name || "Истифодабаранда"}
                </span>
                {review.isVerifiedPurchase && (
                  <Badge variant="success" className="text-[10px]">
                    Хариди тасдиқшуда
                  </Badge>
                )}
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "h-3 w-3",
                      s <= review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            )}
            {review.sellerReply && (
              <div className="mt-3 ml-4 pl-3 border-l-2 border-primary/30">
                <p className="text-xs font-medium text-primary mb-1">Ҷавоби фурӯшанда</p>
                <p className="text-sm">{review.sellerReply}</p>
              </div>
            )}
            {isOwner && !review.sellerReply && (
              <div className="mt-3">
                {replyId === review.id ? (
                  <div className="flex gap-2">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                    <Button size="sm" onClick={() => submitReply(review.id)}>
                      Ҷавоб
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyId(review.id)}
                  >
                    Ҷавоб додан
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Шарҳ нест</p>
        )}
      </div>
    </section>
  );
}
