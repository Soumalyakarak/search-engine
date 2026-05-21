import Link from "next/link";
import { Code2, Search, User, Calendar, BookOpen, ArrowRight } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Code2 className="w-7 h-7 text-[hsl(105,68%,60%)]" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">DSA Search</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Documentation</h1>
          <p className="text-lg text-gray-500">
            Everything you need to know about using DSA Search.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {[
            {
              icon: <Search className="w-5 h-5" />,
              title: "Searching Problems",
              desc: "Learn how to search across 15,000+ problems from LeetCode and Codeforces using keywords, topic names, or problem patterns.",
              href: "#search",
            },
            {
              icon: <BookOpen className="w-5 h-5" />,
              title: "Filters",
              desc: "Filter results by platform (LeetCode / Codeforces) and difficulty (Easy / Medium / Hard) to find exactly what you need.",
              href: "#filters",
            },
            {
              icon: <User className="w-5 h-5" />,
              title: "Profile & Progress",
              desc: "Track your solved problems, view your LeetCode difficulty breakdown and Codeforces rating tier stats.",
              href: "#profile",
            },
            {
              icon: <Calendar className="w-5 h-5" />,
              title: "Contest Calendar",
              desc: "View upcoming contests from LeetCode, Codeforces and AtCoder. Click any contest to register directly.",
              href: "#contests",
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[hsl(105,68%,50%)]">{card.icon}</span>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-[hsl(105,68%,45%)] transition">
                  {card.title}
                </h2>
                <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-[hsl(105,68%,45%)] transition" />
              </div>
              <p className="text-sm text-gray-500">{card.desc}</p>
            </a>
          ))}
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8">

          <div id="search" className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-[hsl(105,68%,50%)]" /> Searching Problems
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Type any keyword, topic, or pattern in the search bar and press Search or hit Enter.
              DSA Search scores and ranks results by relevance across 15,116 problems.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Example queries:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>binary tree</li>
                <li>dynamic programming knapsack</li>
                <li>two sum</li>
                <li>graph shortest path</li>
              </ul>
            </div>
          </div>

          <div id="filters" className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[hsl(105,68%,50%)]" /> Filters
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              After searching, use the filter bar below the search input to narrow results.
            </p>
            <div className="flex flex-col gap-3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Platform filter</p>
                <p className="text-sm text-gray-500">Switch between All Platforms, LeetCode only, or Codeforces only.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Difficulty filter</p>
                <p className="text-sm text-gray-500">Available when LeetCode or All is selected. Filter by Easy, Medium, or Hard.</p>
              </div>
            </div>
          </div>

          <div id="profile" className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[hsl(105,68%,50%)]" /> Profile & Progress
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Mark any problem as solved by clicking the circle icon on the right of a search result.
              Your progress is saved and visible on your profile page.
            </p>
            <div className="flex flex-col gap-3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">LeetCode stats</p>
                <p className="text-sm text-gray-500">Tracks Easy, Medium and Hard problems solved separately with a progress ring.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Codeforces stats</p>
                <p className="text-sm text-gray-500">Problems grouped by all 10 rating tiers from Newbie (≤1199) to Legendary Grandmaster (≥3000).</p>
              </div>
            </div>
          </div>

          <div id="contests" className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[hsl(105,68%,50%)]" /> Contest Calendar
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The contest calendar shows upcoming competitions from LeetCode, Codeforces and AtCoder
              for the next 60 days. Contests are color coded by platform.
            </p>
            <div className="flex flex-col gap-3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Click a date</p>
                <p className="text-sm text-gray-500">Click any highlighted date to see all contests on that day with start time and duration.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Register directly</p>
                <p className="text-sm text-gray-500">Click any contest card to open the registration page on the original platform.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link href="/" className="text-sm text-[hsl(105,68%,50%)] hover:underline">
            ← Back to home
          </Link>
        </div>

      </div>
    </div>
  );
}