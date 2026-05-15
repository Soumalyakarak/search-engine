import Image from "next/image";
import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { SearchResult } from "../SearchClient";

const LOGOS: Record<SearchResult["platform"], string> = {
  leetcode: "/logos/leetcode.png",
  codeforces: "/logos/codeforces.png",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-green-600 bg-green-50",
  medium: "text-yellow-600 bg-yellow-50",
  hard: "text-red-600 bg-red-50",
};

const getDifficultyStyle = (difficulty: string, platform: string) => {
  if (platform === "codeforces") {
    const rating = Number(difficulty);
    if (rating <= 1400) return "text-green-600 bg-green-50";
    return "text-red-600 bg-red-50";
  }
  return DIFFICULTY_COLORS[difficulty] ?? "text-gray-600 bg-gray-100";
};

export default function SearchResults({
  results,
  solvedIds,
  onMarkSolved,
}: {
  results: SearchResult[];
  solvedIds: Set<string>;
  onMarkSolved: (result: SearchResult) => Promise<void>;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleMark = async (e: React.MouseEvent, result: SearchResult) => {
    e.preventDefault();
    if (solvedIds.has(result.id)) return;
    setLoadingId(result.id);
    await onMarkSolved(result);
    setLoadingId(null);
  };

  return (
    <ul className="mt-10 space-y-4">
      {results.map((r) => (
        <li key={r.id}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 p-6 border rounded-2xl hover:bg-gray-50 transition"
          >
            <Image
              src={LOGOS[r.platform]}
              alt={r.platform}
              width={32}
              height={32}
              className="object-contain shrink-0"
            />

            <span className="flex-1 text-xl font-semibold text-blue-600 hover:underline">
              {r.title}
            </span>

            {r.difficulty && (
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getDifficultyStyle(String(r.difficulty), r.platform)}`}
              >
                {r.difficulty}
              </span>
            )}

            <button
              onClick={(e) => handleMark(e, r)}
              disabled={loadingId === r.id}
              title={solvedIds.has(r.id) ? "Solved" : "Mark as solved"}
              className="shrink-0 ml-2 disabled:opacity-50"
            >
              {solvedIds.has(r.id) ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300 hover:text-green-400 transition" />
              )}
            </button>
          </a>
        </li>
      ))}
    </ul>
  );
}