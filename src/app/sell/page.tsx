"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Upload, X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STEPS = ["Категория", "Расмҳо", "Тавсиф", "Нарх", "Ҷойгиршавӣ"];

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: Category[];
}

interface CategoryAttribute {
  id: string;
  name: string;
  slug: string;
  type: string;
  options: string[];
}

export default function SellPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttribute[]>([]);
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    categoryId: "",
    images: [] as string[],
    title: "",
    description: "",
    price: "",
    location: "",
    type: "CLASSIFIED" as "CLASSIFIED" | "PRODUCT",
    condition: "USED" as "NEW" | "USED" | "REFURBISHED",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/sell");
    }
  }, [status, router]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    if (!form.categoryId || categories.length === 0) {
      setCategoryAttributes([]);
      setAttributes({});
      return;
    }
    const flat = categories.flatMap((c) => [c, ...(c.children || [])]);
    const cat = flat.find((c) => c.id === form.categoryId);
    if (!cat) return;

    fetch(`/api/categories/${cat.slug}/attributes`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategoryAttributes(data);
      });
  }, [form.categoryId, categories]);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      setForm((f) => ({ ...f, images: [...f.images, data.url] }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          attributes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/listing/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хатогӣ");
    } finally {
      setLoading(false);
    }
  };

  const canNext = () => {
    switch (step) {
      case 0: return !!form.categoryId;
      case 1: return form.images.length > 0;
      case 2: return form.title.length >= 3 && form.description.length >= 10;
      case 3: return !!form.price && parseFloat(form.price) >= 0;
      case 4: return true;
      default: return false;
    }
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Бор мешавад...</p>
      </div>
    );
  }

  if (!session) return null;

  const allCategories = categories.flatMap((c) => [
    c,
    ...(c.children || []),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Эълон гузоред</h1>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                  ? "bg-primary/20 text-primary ring-2 ring-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn("text-sm hidden sm:inline", i === step && "font-medium")}>
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <>
              <div className="space-y-2">
                <Label>Намуд</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "CLASSIFIED", label: "Эълони шахсӣ" },
                    { value: "PRODUCT", label: "Маҳсулоти мағоза" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: opt.value as typeof f.type }))}
                      className={cn(
                        "rounded-xl border p-4 text-sm font-medium transition-all",
                        form.type === opt.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Категория</Label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
                >
                  <option value="">Интихоб кунед...</option>
                  {allCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                    <Image src={img} alt="" fill className="object-cover" />
                    <button
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          images: f.images.filter((_, j) => j !== i),
                        }))
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {form.images.length < 8 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Бор кунед</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(file);
                      }}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Ҳадди ақал 1 расм, то 8 расм</p>
            </div>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Сарлавҳа</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Масалан: iPhone 15 Pro Max 256GB"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Тавсиф</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Тавсифи муфассали маҳсулот..."
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label>Ҳолат</Label>
                <select
                  value={form.condition}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      condition: e.target.value as typeof f.condition,
                    }))
                  }
                  className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
                >
                  <option value="NEW">Нав</option>
                  <option value="USED">Истифодашуда</option>
                  <option value="REFURBISHED">Таҷдидшуда</option>
                </select>
              </div>

              {categoryAttributes.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium">Хусусиятҳои категория</p>
                  {categoryAttributes.map((attr) => (
                    <div key={attr.id} className="space-y-2">
                      <Label htmlFor={`attr_${attr.slug}`}>{attr.name}</Label>
                      {attr.type === "SELECT" ? (
                        <select
                          id={`attr_${attr.slug}`}
                          value={attributes[attr.slug] || ""}
                          onChange={(e) =>
                            setAttributes((a) => ({ ...a, [attr.slug]: e.target.value }))
                          }
                          className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
                        >
                          <option value="">Интихоб кунед...</option>
                          {attr.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          id={`attr_${attr.slug}`}
                          type={attr.type === "NUMBER" ? "number" : "text"}
                          value={attributes[attr.slug] || ""}
                          onChange={(e) =>
                            setAttributes((a) => ({ ...a, [attr.slug]: e.target.value }))
                          }
                          placeholder={attr.name}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <Label htmlFor="price">Нарх (сомонӣ)</Label>
              <Input
                id="price"
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0"
                min="0"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <Label htmlFor="location">Ҷойгиршавӣ</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Масалан: Душанбе, Сомонӣ 12"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Бозгашт
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                Навбатӣ
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Нашр мешавад..." : "Нашр кардан"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
