"use client";

import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function ProfileDropdown({
  user,
}: {
  user: { id: string; email: string };
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout-user");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-10 h-10 rounded-full bg-black text-white text-xl font-bold flex items-center justify-center">
          {user.email[0].toUpperCase()}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer"
        >
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-500 cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}