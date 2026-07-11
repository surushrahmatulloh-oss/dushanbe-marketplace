"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { status } = useSession();
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
      return;
    }
    if (status === "authenticated" && items.length === 0) {
      router.push("/cart");
      return;
    }
    if (status === "authenticated" && items.length > 0) {
      setReady(true);
    }
  }, [status, items.length, router]);

  if (!ready) {
    return null;
  }

  const subtotal = total();

  const applyCoupon = async () => {
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, total: subtotal }),
    });
    const data = await res.json();
    if (res.ok) {
      setDiscount(data.discount);
      setError("");
    } else {
      setError(data.error);
      setDiscount(0);
    }
  };

  const placeOrder = async () => {
    if (!address.trim()) {
      setError("Суроғаро ворид кунед");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          listingId: i.listingId,
          price: i.price,
          quantity: i.quantity,
        })),
        address,
        paymentMethod,
        couponCode: discount > 0 ? couponCode : undefined,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      clearCart();
      router.push(`/dashboard/orders/${data.id}`);
    } else {
      setError(data.error || "Хатогӣ");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-bold mb-8">Фармоиш</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Суроғаи расонидан</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Шаҳр, кӯча, хона..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Усули пардохт</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { value: "CASH", label: "Нақд ҳангоми гирифтан" },
              { value: "CARD", label: "Корт (онлайн)" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 rounded-xl border border-border p-3 cursor-pointer hover:border-primary/30"
              >
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={paymentMethod === opt.value}
                  onChange={() => setPaymentMethod(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Промокод</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="SUMMER10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
              <Button variant="outline" onClick={applyCoupon}>
                Татбиқ
              </Button>
            </div>
            {discount > 0 && (
              <p className="text-sm text-primary mt-2">
                Тахфиф: -{formatPrice(discount)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Маҳсулот ({items.length})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-primary">
                <span>Тахфиф</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Умумӣ</span>
              <span className="text-primary">{formatPrice(subtotal - discount)}</span>
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button className="w-full" size="lg" onClick={placeOrder} disabled={loading}>
          {loading ? "Фармоиш мешавад..." : "Фармоишро тасдиқ кунед"}
        </Button>
      </div>
    </div>
  );
}
