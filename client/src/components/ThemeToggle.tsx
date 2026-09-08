"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      title="Toggle theme"
      onClick={toggleTheme}
      className="
        cursor-pointer
        flex h-9 w-9 items-center justify-center
        rounded-lg
        border border-gray-200
        bg-white
        text-gray-700
        transition

        hover:border-[#18ED63]
        hover:text-[#18ED63]

        dark:border-[#27312c]
        dark:bg-[#121815]
        dark:text-gray-200

        dark:hover:border-[#18ED63]
        dark:hover:text-[#18ED63]
      "
    >
      {/* Light mode → show moon */}
      <Moon
        size={17}
        className="block dark:hidden"
      />

      {/* Dark mode → show sun */}
      <Sun
        size={17}
        className="hidden dark:block"
      />
    </button>
  );
}