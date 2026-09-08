"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code2,
  Search,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

type AuthLayoutProps = {
  children: React.ReactNode;
  type: "login" | "signup";
};

export default function AuthLayout({ children, type }: AuthLayoutProps) {
  const isLogin = type === "login";

  return (
    <main className="min-h-screen bg-[#f7f8f8]">
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* =====================================================
            LEFT SIDE
        ====================================================== */}
        <section className="relative hidden lg:flex overflow-hidden bg-[#f0fff6]">
          {/* Decorative circles */}
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#baffd2]/40" />

          <div className="absolute -bottom-40 -left-40 h-125 w-125 rounded-full bg-[#c8ffe0]/40" />

          <div
            className="absolute right-20 top-72 h-48 w-48 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(#72e9a0 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
            }}
          />

          <div className="relative z-10 flex w-full flex-col px-16 py-8 xl:px-24">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Code2 size={30} strokeWidth={2.5} className="text-[#18ed63]" />

              <span className="text-2xl font-bold tracking-tight text-[#111111]">
                DSA Search
              </span>
            </Link>

            {/* Main content */}
            <div className="flex flex-1 flex-col justify-center pb-10">
              <div className="max-w-xl">
                <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-[#0b0b0b] xl:text-6xl">
                  {isLogin ? (
                    <>
                      Welcome back to
                      <br />
                      <span className="text-[#13df5a]">smarter DSA</span>.
                    </>
                  ) : (
                    <>
                      Start your
                      <br />
                      DSA journey
                      <br />
                      <span className="text-[#13df5a]">today.</span>
                    </>
                  )}
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-8 text-[#526179]">
                  {isLogin
                    ? "Continue solving, learning, and tracking your progress with DSA Search."
                    : "Join Students who are improving their problem-solving skills with DSA Search."}
                </p>

                {/* Features */}
                <div className="mt-9 space-y-5">
                  <Feature
                    icon={<Zap size={22} />}
                    title="Solve Smarter"
                    description="Find the right problems, faster."
                  />

                  <Feature
                    icon={<BookOpen size={22} />}
                    title="Learn Continuously"
                    description="Curated topics and detailed solutions."
                  />

                  <Feature
                    icon={<Users size={22} />}
                    title="Join a Growing Community"
                    description="Practice alongside thousands of Students."
                  />
                </div>

                {/* Search preview */}
                <div className="relative mt-12 w-97.5 -rotate-2">
                  <div className="rounded-2xl border border-[#d8e8df] bg-white dark:bg-[#121815]  p-4 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                    {/* Browser dots */}
                    <div className="mb-4 flex gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff6257]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ffc043]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-3 rounded-xl bg-[#f5f7f7] px-4 py-3">
                      <Search size={19} className="text-[#8c99a9]" />

                      <span className="text-sm text-[#8995a5]">
                        Search problems...
                      </span>

                      <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[#18ed63]">
                        <ArrowRight size={17} className="text-black dark:text-[#f5f7f6] " />
                      </div>
                    </div>

                    {/* Results */}
                    <div className="mt-3 space-y-2">
                      <SearchResult
                        dot="bg-[#18ed63]"
                        text="Binary Tree Traversal"
                      />

                      <SearchResult
                        dot="bg-blue-500"
                        text="Dynamic Programming"
                      />

                      <SearchResult
                        dot="bg-purple-500"
                        text="Graph Algorithms"
                      />
                    </div>
                  </div>

                  <div className="absolute -right-28 top-16 hidden xl:block rotate-[5deg] rounded-xl border border-[#d7f4e2] bg-white dark:bg-[#121815]  px-5 py-3 text-sm font-medium shadow-lg">
                    <span className="text-[#18ed63]">Practice.</span>
                    <br />
                    Improve.
                    <br />
                    Grow.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}
        <section className="relative flex min-h-screen flex-col bg-linear-to-br from-white via-[#f9fbff] to-[#effaf4]">
          {/* Top navigation */}
          <div className="flex items-center justify-end px-6 py-6 sm:px-10 lg:px-14">
            {isLogin ? (
              <p className="text-sm text-[#657186]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-[#12c951] transition hover:text-[#0da842]"
                >
                  Sign Up <ArrowRight className="inline" size={15} />
                </Link>
              </p>
            ) : (
              <p className="text-sm text-[#657186]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#12c951] transition hover:text-[#0da842]"
                >
                  Login <ArrowRight className="inline" size={15} />
                </Link>
              </p>
            )}
          </div>

          {/* Form */}
          <div className="flex flex-1 items-center justify-center px-5 pb-10 sm:px-8">
            <div className="w-full max-w-125">
              {children}

              {/* Trust indicators */}
              <div className="mt-7 flex items-center justify-center gap-5 text-xs text-[#68758a]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#18ed63]" />
                  Secure
                </div>

                <span className="h-4 w-px bg-[#d7dce2]" />

                <div className="flex items-center gap-1.5">
                  <Users size={14} />
                  45,000+ Users
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   Small components
============================================================ */

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#d9fbea] text-[#0fce50]">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-[#101010]">{title}</h3>

        <p className="mt-0.5 text-sm text-[#647187]">{description}</p>
      </div>
    </div>
  );
}

function SearchResult({ dot, text }: { dot: string; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#f7f8f8] px-3 py-2.5">
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />

      <span className="text-sm font-medium text-[#273142]">{text}</span>
    </div>
  );
}
