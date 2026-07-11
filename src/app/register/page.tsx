"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("Паролҳо мувофиқат намекунанд");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Хатогӣ");
      setLoading(false);
      return;
    }

    // Login with phone (always set) or email
    const loginId = form.email.trim() || form.phone.trim();
    const result = await signIn("credentials", {
      login: loginId,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Бақайдгирӣ</CardTitle>
          <CardDescription>
            Телефон, email (ихтиёрӣ) ва пароли худро интихоб кунед
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ном</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Азиз Раҳимов"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+992 90 000 0000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (ихтиёрӣ)</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Парол (худи шумо интихоб кунед)</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                minLength={6}
                placeholder="Ҳадди ақал 6 ҳарф"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">Такрори парол</Label>
              <Input
                id="passwordConfirm"
                type="password"
                autoComplete="new-password"
                value={form.passwordConfirm}
                onChange={(e) =>
                  setForm((f) => ({ ...f, passwordConfirm: e.target.value }))
                }
                minLength={6}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Бақайдгирӣ..." : "Бақайдгирӣ"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Аллакай ҳисоб доред?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Вуруд
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
