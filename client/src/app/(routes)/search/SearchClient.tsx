"use client";
import { useState } from "react";
import api from "@/lib/api";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";

type RawSearchResult = {
  id: string;
  title: string;
  platform: "leetcode" | "codeforces";
  url: string;
  score: number;
};

export type SearchResult = {
  id: string;
  title: string;
  platform: "leetcode" | "codeforces";
  url: string;
};

const PAGE_SIZE = 10;

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setVisibleCount(PAGE_SIZE);

    try {
      const res = await api.get("/api/search", {
        params: { q: query },
      });

      const data: { results?: RawSearchResult[] } = res.data;

      const cleaned: SearchResult[] = (data.results ?? [])
        .filter((r) => r.score > 0)
        .map((r) => ({
          id: r.id,
          title: r.title,
          platform: r.platform,
          url: r.url,
        }));

      setAllResults(cleaned);
    } catch (err) {
      console.error("Search error:", err);
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleViewMore() {
    setVisibleCount((c) => c + PAGE_SIZE);
  }

  return (
    <>
      <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />

      {loading && <p className="mt-6 text-center text-gray-500">Searching…</p>}

      {!loading && allResults.length > 0 && (
        <>
          <SearchResults results={allResults.slice(0, visibleCount)} />

          {visibleCount < allResults.length && (
            <div className="flex justify-center mt-10 max-w-4xl mx-auto">
              <button
                onClick={handleViewMore}
                className="px-8 py-3 rounded-full border border-gray-300 hover:bg-gray-100 transition font-medium"
              >
                View more problems
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}