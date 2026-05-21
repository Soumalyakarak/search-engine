"use client";

import { Button } from "@/components/ui/button";
import {
  Search,
  Code2,
  Target,
  Zap,
  Users,
  TrendingUp,
  BookOpen,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";

type User = {
  id: string;
  email: string;
};

export default function Home() {
  const [stats, setStats] = useState({
    problems: 0,
    users: 0,
    topics: 0,
  });

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/auth/logged-in-user");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const animateValue = (
      key: keyof typeof stats,
      target: number,
      duration: number
    ) => {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setStats((prev) => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setStats((prev) => ({ ...prev, [key]: Math.floor(current) }));
        }
      }, 16);
    };

    animateValue("problems", 2847, 2000);
    animateValue("users", 45823, 2000);
    animateValue("topics", 87, 2000);
  }, []);

  // add this useEffect in your Home component
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.hash) {
        const el = document.querySelector(target.hash);
        if (el) {
          e.preventDefault();
          const offset = 80; // navbar height
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2 cursor-pointer">
              <Code2 className="w-9 h-9 text-[hsl(105,68%,70%)] dark:text-white" />
              <span className="text-2xl font-extrabold tracking-tight">
                DSA Search
              </span>
            </div>

            <div className="hidden md:flex items-center gap-10 text-[16px] font-semibold text-gray-700 dark:text-gray-300">
              <Link href="#features" className="hover:text-green-500">
                Features
              </Link>
              <Link href="#topics" className="hover:text-green-500">
                Topics
              </Link>
              <Link href="#pricing" className="hover:text-green-500">
                Pricing
              </Link>
              <Link href="/docs" className="hover:text-green-500">
                Docs
              </Link>
              <Link href="/contests" className="hover:text-green-500">
                Contests
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {loadingAuth ? null : !user ? (
                <>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="h-12 px-8 rounded-full font-bold"
                    >
                      Log in
                    </Button>
                  </Link>

                  <Link href="/signup">
                    <Button className="h-12 px-8 rounded-full bg-[hsl(105,68%,77%)] font-bold text-black">
                      Get started for free
                    </Button>
                  </Link>
                </>
              ) : (
                <ProfileDropdown user={user} />
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative py-20 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Your DSA problem search engine
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
            Search,filter,and practice smarter
          </p>

          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex items-center p-1.5 border-2 border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-900 focus-within:border-[hsl(105,68%,70%)] transition-colors shadow-sm">
              <div className="pl-5 text-gray-400">
                <Search className="w-6 h-6" />
              </div>

              <input
                type="text"
                placeholder="Search for problems... (e.g., binary tree, dynamic programming)"
                className="flex-1 px-4 py-4 text-lg bg-transparent border-none outline-none focus:ring-0 text-gray-700 dark:text-gray-200 placeholder-gray-400"
              />

              <Link
                href="/search"
                className="flex items-center gap-2 h-15 px-6 bg-[hsl(105,68%,77%)] hover:bg-[hsl(105,68%,70%)] text-black font-medium text-lg rounded-full transition-all active:scale-95 shrink-0"
                role="button"
              >
                Start searching for free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            DSA Search is trusted by developers worldwide
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[hsl(105,68%,70%)] mb-2">
                {stats.problems.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Problems indexed
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[hsl(105,68%,70%)] mb-2">
                {stats.users.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Active users
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[hsl(105,68%,70%)] mb-2">
                {stats.topics}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Topics covered
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Core features
            </h2>
          </div>

          <div className="space-y-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Smart Search
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Find problems by topic, difficulty, company, or pattern. Our
                  intelligent search understands what you&apos;re looking for
                  and surfaces the most relevant problems instantly.
                </p>
                <Link
                  href="/search"
                  className="text-[hsl(105,68%,70%)] hover:text-[hsl(105,68%,65%)] font-medium inline-flex items-center gap-2"
                >
                  Learn more about Smart Search →
                </Link>
              </div>
              <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-3xl p-8 lg:p-12 border border-gray-200 dark:border-gray-800">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Search className="w-6 h-6 text-gray-400" />
                    <input
                      type="text"
                      placeholder="binary tree traversal..."
                      className="flex-1 text-lg border-none outline-none bg-transparent"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    {[
                      "Binary Tree Level Order Traversal",
                      "Binary Tree Inorder Traversal",
                      "Binary Tree Zigzag Traversal",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 bg-linear-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-3xl p-8 lg:p-12 border border-gray-200 dark:border-gray-800">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        47
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Easy
                      </div>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        128
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Medium
                      </div>
                    </div>
                    <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600">32</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Hard
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="text-sm font-medium">207/2847</span>
                  </div>
                  <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "7%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Track Your Progress
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Monitor your learning journey with detailed analytics. See
                  which topics you&apos;ve mastered and where you need more
                  practice.
                </p>
                <Link
                  href="/profile"
                  className="text-[hsl(105,68%,70%)] hover:text-[hsl(105,68%,65%)] font-medium inline-flex items-center gap-2"
                >
                  Learn more about Progress Tracking →
                </Link>
              </div>
            </div>

            {/* Replace the entire Company-Specific Problems section with this */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Contest Calendar
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Never miss a contest again. Track upcoming competitions from
                  LeetCode, Codeforces, and AtCoder in one place. Click any
                  contest to register and participate directly.
                </p>
                <Link
                  href="/contests"
                  className="text-[hsl(105,68%,70%)] hover:text-[hsl(105,68%,65%)] font-medium inline-flex items-center gap-2"
                >
                  View Contest Calendar →
                </Link>
              </div>

              <div className="bg-linear-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-3xl p-8 lg:p-12 border border-gray-200 dark:border-gray-800">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg space-y-3">
                  {[
                    {
                      platform: "AtCoder",
                      time: "In 3 days · 9:00 PM",
                      duration: "100m",
                      color: "#10B981",
                    },
                    {
                      platform: "Codeforces",
                      time: "In 5 days · 7:35 PM",
                      duration: "2.5h",
                      color: "#3B82F6",
                    },
                    {
                      platform: "LeetCode",
                      time: "Tomorrow · 8:00 AM",
                      duration: "1.5h",
                      color: "#F97316",
                    },
                  ].map((contest, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: contest.color }}
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {contest.platform}
                          </p>
                          <p className="text-xs text-gray-500">
                            {contest.time}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 bg-white dark:bg-gray-700 px-2 py-1 rounded-full">
                        {contest.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="topics"
        className="py-24 px-6 bg-gray-50 dark:bg-gray-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Popular topics
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Master the fundamentals and advanced concepts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Arrays", icon: "📊", count: 342 },
              { name: "Linked Lists", icon: "🔗", count: 128 },
              { name: "Trees", icon: "🌳", count: 267 },
              { name: "Graphs", icon: "🕸️", count: 184 },
              { name: "Dynamic Programming", icon: "🎯", count: 219 },
              { name: "Sorting", icon: "📈", count: 97 },
              { name: "Hash Tables", icon: "🗂️", count: 156 },
              { name: "Recursion", icon: "🔄", count: 143 },
            ].map((topic, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{topic.icon}</div>
                <h3 className="text-lg font-bold mb-2">{topic.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {topic.count} problems
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why developers choose DSA Search
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-blue-600" />,
                title: "Lightning Fast",
                description:
                  "Search through thousands of problems in milliseconds. No more endless scrolling.",
              },
              {
                icon: <Target className="w-8 h-8 text-blue-600" />,
                title: "Laser Focused",
                description:
                  "Filter by difficulty, company, topic, or pattern to find exactly what you need.",
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
                title: "Stay Updated",
                description:
                  "New problems added daily. Stay current with the latest interview questions.",
              },
              {
                icon: <BookOpen className="w-8 h-8 text-blue-600" />,
                title: "Learn Smarter",
                description:
                  "Curated learning paths and detailed explanations for every problem.",
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Join the Community",
                description:
                  "Connect with thousands of developers. Share solutions and learn together.",
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
                title: "Track Everything",
                description:
                  "Monitor your progress, set goals, and celebrate your achievements.",
              },
            ].map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="py-24 px-6 bg-[hsl(105,68%,65%)] text-black"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Start mastering DSA today
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 text-black">
            Join 45,000+ developers who are leveling up their problem-solving
            skills
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="h-16 px-12 text-xl bg-[hsl(110,19%,36%)] text-white rounded-full font-bold"
            >
              Get started for free
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-50 dark:bg-gray-900/50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-8 h-8 text-[hsl(105,68%,70%)]" />
                <span className="text-xl font-bold">DSA Search</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                The most comprehensive DSA problem search engine for developers.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#topics"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Topics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contests"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Contests
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link
                    href="/search"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Search Problems
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:soumalyakarak2@gmail.com"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} DSA Search. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
