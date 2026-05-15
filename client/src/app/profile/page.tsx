"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/api";

type Stats = {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  cf_newbie: number;
  cf_pupil: number;
  cf_specialist: number;
  cf_expert: number;
  cf_cm: number;
  cf_master: number;
  cf_im: number;
  cf_gm: number;
  cf_igm: number;
  cf_lgm: number;
  leetcode: number;
  codeforces: number;
};

const TOTAL_PROBLEMS = 15116;
const TOTAL_LEETCODE = 3930;
const TOTAL_CODEFORCES = 11186;

const CF_RANKS = [
  { key: "cf_newbie",     label: "Newbie",               range: "≤ 1199",    color: "#888780" },
  { key: "cf_pupil",      label: "Pupil",                range: "1200–1399", color: "#5DCAA5" },
  { key: "cf_specialist", label: "Specialist",           range: "1400–1599", color: "#85B7EB" },
  { key: "cf_expert",     label: "Expert",               range: "1600–1899", color: "#7F77DD" },
  { key: "cf_cm",         label: "Candidate Master",     range: "1900–2099", color: "#EF9F27" },
  { key: "cf_master",     label: "Master",               range: "2100–2299", color: "#F0997B" },
  { key: "cf_im",         label: "International Master", range: "2300–2399", color: "#D85A30" },
  { key: "cf_gm",         label: "Grandmaster",          range: "2400–2599", color: "#E24B4A" },
  { key: "cf_igm",        label: "International GM",     range: "2600–2999", color: "#A32D2D" },
  { key: "cf_lgm",        label: "Legendary GM",         range: "≥ 3000",    color: "#501313" },
];

function CircularProgress({
  value,
  total,
  color,
  size = 100,
  label,
}: {
  value: number;
  total: number;
  color: string;
  size?: number;
  label: string;
}) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / total, 1);
  const offset = circumference - pct * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="46" textAnchor="middle" fontSize="14" fontWeight="600" fill="currentColor">
          {value}
        </text>
        <text x="50" y="60" textAnchor="middle" fontSize="9" fill="#9ca3af">
          / {total}
        </text>
      </svg>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          api.get("/api/auth/logged-in-user"),
          api.get("/api/auth/problem-stats"),
        ]);
        setUser(userRes.data.user);
        setStats(statsRes.data.stats);
      } catch {
        // silent
      }
    };
    load();
  }, []);

  if (!user || !stats) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  const completion = ((stats.total / TOTAL_PROBLEMS) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">

        {/* User info */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-16 h-16 rounded-full bg-black text-white text-2xl font-bold flex items-center justify-center shrink-0">
                {user.email[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold truncate text-gray-900 dark:text-white">
                  {user.email}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">DSA Search Member</p>
              </div>
            </div>
            <div className="flex items-center gap-8 border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-800 pt-4 sm:pt-0 sm:pl-8 flex-wrap">
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.leetcode}</p>
                <p className="text-xs text-gray-500 mt-1">LeetCode</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.codeforces}</p>
                <p className="text-xs text-gray-500 mt-1">Codeforces</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completion}%</p>
                <p className="text-xs text-gray-500 mt-1">Complete</p>
              </div>
            </div>
          </div>
        </div>

        {/* LeetCode + Codeforces */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* LeetCode */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Image src="/logos/leetcode.png" alt="leetcode" width={20} height={20} className="object-contain" />
              <p className="text-base font-semibold text-gray-900 dark:text-white">LeetCode</p>
            </div>

            {/* Circular progress + breakdown */}
            <div className="flex items-center justify-around mb-4">
              <CircularProgress value={stats.total} total={TOTAL_LEETCODE} color="hsl(105,68%,45%)" label="Total" size={320} />
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-8">
                  <span className="text-sm text-green-600">Easy</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.easy}</span>
                </div>
                <div className="flex items-center justify-between gap-8">
                  <span className="text-sm text-yellow-600">Medium</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.medium}</span>
                </div>
                <div className="flex items-center justify-between gap-8">
                  <span className="text-sm text-red-600">Hard</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.hard}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-xl font-semibold text-green-700">{stats.easy}</p>
                <p className="text-xs text-green-700 mt-1">Easy</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3 text-center">
                <p className="text-xl font-semibold text-yellow-700">{stats.medium}</p>
                <p className="text-xs text-yellow-700 mt-1">Medium</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-xl font-semibold text-red-700">{stats.hard}</p>
                <p className="text-xs text-red-700 mt-1">Hard</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3">{stats.leetcode} / {TOTAL_LEETCODE} problems</p>
          </div>

          {/* Codeforces */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Image src="/logos/codeforces.png" alt="codeforces" width={20} height={20} className="object-contain" />
              <p className="text-base font-semibold text-gray-900 dark:text-white">Codeforces</p>
            </div>

            <div className="flex flex-col gap-2">
              {CF_RANKS.map((rank) => (
                <div
                  key={rank.key}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: rank.color }} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{rank.label}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">{rank.range}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {stats[rank.key as keyof Stats]}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">{stats.codeforces} / {TOTAL_CODEFORCES} problems</p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-semibold text-gray-900 dark:text-white">Overall progress</p>
            <span className="text-sm text-gray-500">{stats.total} / {TOTAL_PROBLEMS}</span>
          </div>
          <div className="flex items-center justify-around gap-8 flex-wrap">
            <CircularProgress value={stats.total} total={TOTAL_PROBLEMS} color="hsl(105,68%,45%)" label="All problems" size={180} />
            <CircularProgress value={stats.leetcode} total={TOTAL_LEETCODE} color="#EF9F27" label="LeetCode" size={180} />
            <CircularProgress value={stats.codeforces} total={TOTAL_CODEFORCES} color="#85B7EB" label="Codeforces" size={180} />
          </div>
        </div>

      </div>
    </div>
  );
}