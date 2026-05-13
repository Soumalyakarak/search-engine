import Image from 'next/image';
import { SearchResult } from '../SearchClient';

const LOGOS: Record<SearchResult['platform'], string> = {
  leetcode: '/logos/leetcode.png',
  codeforces: '/logos/codeforces.png',
};

export default function SearchResults({
  results,
}: {
  results: SearchResult[];
}) {
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

            <span className="text-xl font-semibold text-blue-600 hover:underline">
              {r.title}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
