"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      login: login.trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email/телефон ё парол нодуруст аст");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  const hasGoogle = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Вуруд</CardTitle>
          <CardDescription>
            Бо email ё рақами телефон ва пароли худ ворид шавед
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Email ё телефон</Label>
              <Input
                id="login"
                type="text"
                inputMode="email"
                autoComplete="username"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="email@example.com ё +992 90 000 0000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Парол</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Вуруд..." : "Вуруд"}
            </Button>
          </form>

          {hasGoogle && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ё</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("google", { callbackUrl })}
              >
                Вуруд бо Google
              </Button>
            </>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Ҳисоб надоред?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Бақайдгирӣ
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
