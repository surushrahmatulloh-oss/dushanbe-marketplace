"use client";

import { SearchAutocomplete } from "@/components/search/search-autocomplete";
import { AiSearchBar } from "@/components/search/ai-search-bar";

export function HomeSearchSection() {
  return (
    <section className="container mx-auto px-4 pb-6 -mt-2">
      <div className="max-w-2xl mx-auto space-y-4">
        <SearchAutocomplete className="w-full" />
        <AiSearchBar />
      </div>
    </section>
  );
}
