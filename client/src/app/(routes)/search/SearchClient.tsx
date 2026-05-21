"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import SearchBar, { Filters } from "./components/SearchBar";
import SearchResults from "./components/SearchResults";

type RawSearchResult = {
  id: string;
  title: string;
  platform: "leetcode" | "codeforces";
  url: string;
  score: number;
  difficulty?: string;
};

export type SearchResult = {
  id: string;
  title: string;
  platform: "leetcode" | "codeforces";
  url: string;
  difficulty?: string;
};

const PAGE_SIZE = 10;

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Filters>({
    platform: "all",
    difficulty: "all",
  });

  // ← seed solved problems on mount
  useEffect(() => {
    const fetchSolved = async () => {
      try {
        const res = await api.get("/api/auth/solved-problems");
        const ids: string[] = res.data.problems.map(
          (p: { problemId: string }) => p.problemId
        );
        setSolvedIds(new Set(ids));
      } catch {
        // user not logged in or no solved problems yet — silent fail
      }
    };
    fetchSolved();
  }, []);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setVisibleCount(PAGE_SIZE);
    try {
      const res = await api.get("/api/search", { params: { q: query } });
      const data: { results?: RawSearchResult[] } = res.data;
      const cleaned: SearchResult[] = (data.results ?? [])
        .filter((r) => r.score > 0)
        .map((r) => ({
          id: r.id,
          title: r.title,
          platform: r.platform,
          url: r.url,
          difficulty: r.difficulty,
        }));
      setAllResults(cleaned);
    } catch (err) {
      console.error("Search error:", err);
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkSolved(result: SearchResult) {
    try {
      await api.post("/api/auth/mark-problem", {
        problemId: result.id,
        platform: result.platform,
        difficulty: result.difficulty != null ? String(result.difficulty) : null,
      });
      setSolvedIds((prev) => new Set(prev).add(result.id));
    } catch (err) {
      console.error("Failed to mark solved:", err);
    }
  }

  function handleViewMore() {
    setVisibleCount((c) => c + PAGE_SIZE);
  }

  // apply filters client-side
  const filteredResults = allResults.filter((r) => {
    if (filters.platform !== "all" && r.platform !== filters.platform) return false;
    if (
      filters.difficulty !== "all" &&
      r.platform === "leetcode" &&
      r.difficulty?.toLowerCase() !== filters.difficulty
    ) return false;
    return true;
  });

  return (
    <>
      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={setFilters}
      />

      {loading && (
        <p className="mt-6 text-center text-gray-500">Searching…</p>
      )}

      {!loading && allResults.length > 0 && filteredResults.length === 0 && (
        <p className="mt-6 text-center text-gray-400">
          No results match the selected filters.
        </p>
      )}

      {!loading && filteredResults.length > 0 && (
        <>
          <p className="mt-4 px-1 text-sm text-gray-400">
            {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
            {filters.platform !== "all" || filters.difficulty !== "all" ? " (filtered)" : ""}
          </p>

          <SearchResults
            results={filteredResults.slice(0, visibleCount)}
            solvedIds={solvedIds}
            onMarkSolved={handleMarkSolved}
          />

          {visibleCount < filteredResults.length && (
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