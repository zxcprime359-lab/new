"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import useSearch from "@/hook/get-search";

const KEYWORDS = [
  // Emotional
  "heartbroken",
  "feel-good",
  "nostalgic",
  "anxiety",
  "romantic",
  "melancholy",
  "euphoric",
  "anger",
  // Vibes
  "adrenaline",
  "cozy",
  "dark",
  "mind-bending",
  "comedy",
  "suspense",
  "surreal",
  "wholesome",
  // Situations
  "late night",
  "motivation",
  "family",
  "date night",
  "rainy day",
  "plot twist",
  "cry it out",
  "background noise",
];

type KeywordTypes = {
  id: string;
  name: string;
};
export default function MoodSearch() {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const { data } = useSearch<KeywordTypes>({
    query: "hero",
    media_type: "keyword",
  });
  console.log(data);
  function toggle(kw: string) {
    setSelected((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw],
    );
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  const hasSelection = selected.length > 0 || query.trim().length > 0;

  function handleSearch() {
    if (!hasSelection) return;
    const terms = [...selected, ...(query.trim() ? [query.trim()] : [])];
    console.log("Searching:", terms);
  }
  const results = data?.pages.flatMap((page) => page.results) ?? [];
  return (
    <div className="flex-1 bg-black min-h-screen flex flex-col items-center justify-center px-6 py-20">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className=" text-5xl font-semibold tracking-tight mb-2">
          What are you in the mood for?
        </h1>
        <p className="text-muted-foreground text-lg">
          Pick a few keywords, or describe it yourself.
        </p>
      </div>

      {/* Input + CTA row */}
      <div className="flex items-center gap-2 w-full max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
          <Input
            value={query}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Or describe it yourself…"
            className="pl-9 h-10 bg-zinc-900  border-zinc-800 text-zinc-100 placeholder:text-zinc-600
                       focus-visible:ring-0 focus-visible:border-zinc-600  text-sm"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={!hasSelection}
          className="h-10 px-5 bg-white text-black hover:bg-zinc-200 rounded-full text-sm font-medium
                     disabled:opacity-25 disabled:cursor-not-allowed shrink-0"
        >
          Find films
        </Button>
      </div>

      {/* Selection count */}
      {selected.length > 0 && (
        <div className="mt-5 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {selected.length} keyword{selected.length > 1 ? "s" : ""} selected
          </span>
          <button
            onClick={() => setSelected([])}
            className="text-sm text-muted-foreground hover:text-zinc-400 transition-colors underline underline-offset-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
