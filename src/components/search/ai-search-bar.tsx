"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Search, Mic, MicOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listings/listing-card";
import { cn } from "@/lib/utils";

interface AiListing {
  id: string;
  title: string;
  price: number;
  images: string;
  location?: string | null;
  condition?: string;
  type?: string;
}

type VoiceLang = "ru-RU" | "en-US";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

const EXAMPLES = [
  "Мошини арзон дар доираи 5000 сомонӣ",
  "Хонаи 2-хонагӣ наздики марказ",
  "Барои фарзанд либоси зимистонӣ, на он қадар қимат",
];

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function AiSearchBar({ inline = false }: { inline?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<VoiceLang>("ru-RU");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [summary, setSummary] = useState("");
  const [fallback, setFallback] = useState(false);
  const [listings, setListings] = useState<AiListing[]>([]);
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSpeechSupported(Boolean(getSpeechRecognition()));
  }, []);

  const search = useCallback(
    async (text?: string) => {
      const q = (text ?? query).trim();
      if (q.length < 2) return;

      setLoading(true);
      setError("");
      setSummary("");
      setListings([]);
      setOpen(true);

      try {
        const res = await fetch("/api/ai-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });

        const data = await res.json();

        if (!res.ok) {
          router.push(`/search?q=${encodeURIComponent(q)}`);
          return;
        }

        setSummary(data.summary || "");
        setFallback(Boolean(data.fallback));
        setListings(data.listings || []);

        if (data.listings?.length === 0 && data.fallback) {
          router.push(`/search?q=${encodeURIComponent(q)}`);
        }
      } catch {
        router.push(`/search?q=${encodeURIComponent(q)}`);
      } finally {
        setLoading(false);
      }
    },
    [query, router]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) return;

    stopListening();

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = voiceLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setQuery(transcript);
        setOpen(true);
        search(transcript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceLang, stopListening, search]);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  const toggleVoiceLang = () => {
    setVoiceLang((l) => (l === "ru-RU" ? "en-US" : "ru-RU"));
  };

  const close = () => {
    stopListening();
    setOpen(false);
    setListings([]);
    setSummary("");
    setError("");
  };

  return (
    <>
      {!inline && <div className="h-16 md:hidden" aria-hidden />}

      <div
        className={cn(
          "z-40 w-full max-w-2xl mx-auto",
          inline
            ? "relative"
            : "fixed bottom-20 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto md:sticky md:top-[4.5rem]"
        )}
      >
        {/* Pill bar */}
        <div
          className={cn(
            "flex items-center gap-2 rounded-full border border-primary/25",
            "bg-background/95 backdrop-blur-lg shadow-lg shadow-primary/10",
            "px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300",
            listening && "ring-2 ring-primary/40 ring-offset-2"
          )}
        >
          <Sparkles className="h-4 w-4 text-primary shrink-0" />

          {open ? (
            <input
              ref={inputRef}
              type="text"
              autoFocus
              placeholder="Чиро мехоҳед ёбед?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  search();
                }
                if (e.key === "Escape") close();
              }}
              className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="flex-1 text-left text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
            >
              🔍 Ҷустуҷӯи ҳушманд
            </button>
          )}

          {speechSupported && (
            <>
              <button
                type="button"
                onClick={toggleVoiceLang}
                className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors"
                title="Забони сухан"
              >
                {voiceLang === "ru-RU" ? "RU" : "EN"}
              </button>
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                disabled={loading}
                className={cn(
                  "shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  listening
                    ? "bg-primary text-primary-foreground animate-pulse"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                aria-label={listening ? "Қатъ кардан" : "Сухан гуфтан"}
              >
                {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            </>
          )}

          {open ? (
            <>
              <button
                type="button"
                onClick={() => search()}
                disabled={loading || query.trim().length < 2}
                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                aria-label="Ҷустуҷӯ"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={close}
                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                aria-label="Пӯшидан"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : null}
        </div>

        {listening && (
          <p className="text-center text-xs text-primary mt-2 animate-pulse">
            Гӯш карда истодаам... ({voiceLang === "ru-RU" ? "русӣ" : "англисӣ"})
          </p>
        )}

        {/* Expanded panel */}
        {open && (
          <div className="mt-3 rounded-2xl border border-border bg-card shadow-xl p-4 sm:p-5 space-y-4 animate-fade-in max-h-[60vh] overflow-y-auto">
            {!loading && !summary && listings.length === 0 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Бо забони тоҷикӣ, русӣ ё англисӣ нависед ё бо микрофон гап занед
                </p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => {
                        setQuery(ex);
                        search(ex);
                      }}
                      className="rounded-full bg-muted px-3 py-1 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Метавонам, як лаҳза...
              </div>
            )}

            {summary && (
              <div
                className={cn(
                  "rounded-xl p-4 text-sm",
                  fallback
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-foreground"
                )}
              >
                {fallback && (
                  <span className="text-xs block mb-1 opacity-70">
                    (ҷустуҷӯи оддӣ — AI дастрас нест)
                  </span>
                )}
                {summary}
              </div>
            )}

            {listings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listings.slice(0, 8).map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))}
              </div>
            )}

            {summary && listings.length > 0 && (
              <Button
                variant="link"
                className="px-0 h-auto"
                onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
              >
                Ҳамаи натиҷаҳо →
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
