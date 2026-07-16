import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  /** Show wordmark beside the mark */
  showWordmark?: boolean;
  /** Compact = Bozor.tj only on small screens handled by parent */
  size?: "sm" | "md";
};

export function BrandLogo({
  className,
  showWordmark = true,
  size = "md",
}: BrandLogoProps) {
  const mark = size === "sm" ? "h-8 w-8 rounded-[9px]" : "h-9 w-9 rounded-[10px]";
  const cart = size === "sm" ? "h-[55%] w-[55%]" : "h-[55%] w-[55%]";

  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2.5 shrink-0 transition-transform duration-200 hover:scale-[1.03]",
        className
      )}
    >
      <span
        className={cn(
          "relative flex items-center justify-center shadow-sm",
          "bg-[linear-gradient(135deg,#639922_0%,#0F6E56_100%)]",
          "text-white",
          mark
        )}
        aria-hidden
      >
        <ShoppingCart
          className={cn(cart, "text-white")}
          strokeWidth={1.6}
          absoluteStrokeWidth={false}
        />
      </span>

      {showWordmark ? (
        <span className="hidden min-[380px]:flex flex-col leading-none">
          <span className="text-[15px] sm:text-base font-bold tracking-tight text-neutral-900">
            Bozor.tj
          </span>
          <span className="mt-0.5 text-[10px] sm:text-[11px] font-medium tracking-wide text-muted-foreground">
            Dushanbe
          </span>
        </span>
      ) : null}
      <span className="sr-only">Bozor.tj — Dushanbe Маркетплейс</span>
    </Link>
  );
}
