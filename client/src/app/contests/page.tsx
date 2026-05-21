"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Contest = {
  id: number;
  title: string;
  platform: string;
  label: string;
  color: string;
  start: string;
  end: string;
  duration: number;
  url: string;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/api/contests");
        setContests(res.data.contests);
      } catch {
        setContests([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // group contests by date string YYYY-MM-DD
  const contestsByDate: Record<string, Contest[]> = {};
  contests.forEach((c) => {
    const date = new Date(c.start);
    if (date.getFullYear() === year && date.getMonth() === month) {
      const key = date.toISOString().split("T")[0];
      if (!contestsByDate[key]) contestsByDate[key] = [];
      contestsByDate[key].push(c);
    }
  });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const selectedContests = selectedDay ? (contestsByDate[selectedDay] ?? []) : [];

  // build calendar cells
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading contests...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contest Calendar</h1>
            <p className="text-sm text-gray-500 mt-1">Upcoming contests from LeetCode, Codeforces and AtCoder</p>
          </div>
          {/* Platform legend */}
          <div className="hidden sm:flex items-center gap-4">
            {[
              { label: "Codeforces", color: "#3B82F6" },
              { label: "LeetCode",   color: "#F97316" },
              { label: "AtCoder",    color: "#10B981" },
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs text-gray-500">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">

          {/* Month nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800">
            {DAYS.map((d) => (
              <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (!day) return (
                <div key={`empty-${i}`} className="min-h-22.5 border-b border-r border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50" />
              );

              const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayContests = contestsByDate[dateKey] ?? [];
              const isToday =
                today.getDate() === day &&
                today.getMonth() === month &&
                today.getFullYear() === year;
              const isSelected = selectedDay === dateKey;

              return (
                <div
                  key={dateKey}
                  onClick={() => setSelectedDay(isSelected ? null : dateKey)}
                  className={`min-h-22.5 border-b border-r border-gray-100 dark:border-gray-800 p-1.5 cursor-pointer transition-colors
                    ${isSelected ? "bg-gray-50 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}
                  `}
                >
                  {/* Day number */}
                  <div className="flex justify-end mb-1">
                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                      ${isToday
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {day}
                    </span>
                  </div>

                  {/* Contest dots/pills */}
                  <div className="flex flex-col gap-0.5">
                    {dayContests.slice(0, 3).map((c) => (
                      <div
                        key={c.id}
                        className="text-white text-[10px] font-medium px-1.5 py-0.5 rounded truncate"
                        style={{ backgroundColor: c.color }}
                        title={c.title}
                      >
                        {c.label}
                      </div>
                    ))}
                    {dayContests.length > 3 && (
                      <span className="text-[10px] text-gray-400 pl-1">+{dayContests.length - 3} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected day contests */}
        {selectedDay && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Contests on {new Date(selectedDay + "T00:00:00").toLocaleDateString([], {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })}
            </h3>

            {selectedContests.length === 0 ? (
              <p className="text-sm text-gray-400">No contests on this day.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedContests.map((c) => (
                  <Link
                    key={c.id}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: c.color }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition">
                          {c.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatTime(c.start)} · {formatDuration(c.duration)}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-xs font-medium px-3 py-1 rounded-full text-white shrink-0 ml-4"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.label}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming contests list */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming contests
          </h3>
          <div className="flex flex-col gap-3">
            {contests.slice(0, 8).map((c) => (
              <Link
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-md transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600">
                      {c.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(c.start).toLocaleDateString([], {
                        weekday: "short", month: "short", day: "numeric"
                      })} · {formatTime(c.start)} · {formatDuration(c.duration)}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full text-white shrink-0 ml-4"
                  style={{ backgroundColor: c.color }}
                >
                  {c.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}