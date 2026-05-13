import { Search } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onSearch,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex flex-1 items-center p-1.5 border-2 border-gray-200 rounded-full bg-white shadow-sm focus-within:border-[hsl(105,68%,70%)]">
        <div className="pl-5 text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for problems (e.g. two sum, binary tree)"
          className="flex-1 px-4 py-3 text-lg bg-transparent outline-none"
        />
      </div>

      <button
        onClick={onSearch}
        className="px-8 py-3 rounded-full bg-[hsl(105,68%,77%)] hover:bg-[hsl(105,68%,70%)] font-medium transition active:scale-95"
      >
        Search
      </button>
    </div>
  );
}
