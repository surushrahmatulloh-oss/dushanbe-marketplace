"use client";

import { ORDER_STATUSES, getOrderStatusLabel, parseStatusHistory } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface OrderTrackerProps {
  status: string;
  statusHistory: string;
  trackingNumber?: string | null;
}

export function OrderTracker({ status, statusHistory, trackingNumber }: OrderTrackerProps) {
  const history = parseStatusHistory(statusHistory);
  const currentIndex = ORDER_STATUSES.findIndex((s) => s.key === status);

  const activeSteps = ORDER_STATUSES.filter(
    (s) => !["CANCELLED", "RETURNED"].includes(s.key)
  );

  return (
    <div className="space-y-6">
      {trackingNumber && (
        <div className="rounded-xl bg-muted/50 px-4 py-3">
          <p className="text-xs text-muted-foreground">Рақами пайгирӣ</p>
          <p className="font-mono font-bold text-lg">{trackingNumber}</p>
        </div>
      )}

      <div className="relative">
        {activeSteps.map((step, i) => {
          const done = i <= currentIndex && !["CANCELLED", "RETURNED"].includes(status);
          const isCurrent = step.key === status;

          return (
            <div key={step.key} className="flex gap-4 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors z-10",
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : <span className="text-xs">{i + 1}</span>}
                </div>
                {i < activeSteps.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 -mt-0.5",
                      done && i < currentIndex ? "bg-primary" : "bg-border"
                    )}
                    style={{ minHeight: "2rem" }}
                  />
                )}
              </div>
              <div className="pt-1">
                <p
                  className={cn(
                    "font-medium text-sm",
                    isCurrent && "text-primary"
                  )}
                >
                  {step.label}
                </p>
                {history.find((h) => h.status === step.key) && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(
                      history.find((h) => h.status === step.key)!.at
                    ).toLocaleString("tg-TJ")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {["CANCELLED", "RETURNED"].includes(status) && (
        <p className="text-sm font-medium text-destructive">
          Статус: {getOrderStatusLabel(status)}
        </p>
      )}
    </div>
  );
}
