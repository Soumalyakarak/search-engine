import { Search } from "lucide-react";
import Link from "next/link";

export type Filters = {
  platform: "all" | "leetcode" | "codeforces";
  difficulty: "all" | "easy" | "medium" | "hard";
};

export default function SearchBar({
  value,
  onChange,
  onSearch,
  filters,
  onFilterChange,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  filters: Filters;
  onFilterChange: (f: Filters) => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to home
      </Link>
      {/* Search input */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex flex-1 items-center p-1.5 border-2 border-gray-200 dark:border-[#27312c] rounded-full bg-white dark:bg-[#121815]  shadow-sm focus-within:border-[hsl(105,68%,70%)]">
          <div className="pl-5 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Search for problems (e.g. two sum, binary tree)"
            className="flex-1 px-4 py-3 text-lg bg-transparent outline-none"
          />
        </div>
        <button
          onClick={onSearch}
          className="px-8 py-3 rounded-full bg-[hsl(105,68%,77%)] hover:bg-[hsl(105,68%,70%)] font-medium transition active:scale-95 cursor-pointer"
        >
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap px-1">
        {/* Platform filter */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#121815]  border border-gray-200 dark:border-[#27312c]   rounded-full px-1 py-1 shadow-sm">
          {(["all", "leetcode", "codeforces"] as const).map((p) => (
            <button
              key={p}
              onClick={() =>
                onFilterChange({ ...filters, platform: p, difficulty: "all" })
              }
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filters.platform === p
                  ? "bg-[hsl(105,68%,70%)] text-black dark:text-[#f5f7f6] "
                  : "text-gray-500 dark:text-[#9aa7a0]  hover:text-gray-800"
              }`}
            >
              {p === "all"
                ? "All Platforms"
                : p === "leetcode"
                ? "LeetCode"
                : "Codeforces"}
            </button>
          ))}
        </div>

        {/* Difficulty filter — only for leetcode or all */}
        {filters.platform !== "codeforces" && (
          <div className="flex items-center gap-1 bg-white dark:bg-[#121815]  border border-gray-200 dark:border-[#27312c]   rounded-full px-1 py-1 shadow-sm">
            {(["all", "easy", "medium", "hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => onFilterChange({ ...filters, difficulty: d })}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition capitalize ${
                  filters.difficulty === d
                    ? d === "easy"
                      ? "bg-green-100 text-green-700"
                      : d === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : d === "hard"
                      ? "bg-red-100 text-red-700"
                      : "bg-[hsl(105,68%,70%)] text-black dark:text-[#f5f7f6] "
                    : "text-gray-500 dark:text-[#9aa7a0]  hover:text-gray-800"
                }`}
              >
                {d === "all" ? "All Levels" : d}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
