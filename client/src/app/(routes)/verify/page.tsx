"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/api";

type ApiError = { message?: string };

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [serverError, setServerError] = useState<string | null>(null);

  const verifyMutation = useMutation<unknown, AxiosError<ApiError>>({
    mutationFn: async () => {
      const res = await api.post("/api/auth/verify-user", {
        email,
        otp: otp.join(""),
      });
      return res.data;
    },
    onSuccess: () => router.push("/login"),
    onError: (error) => {
      setServerError(error.response?.data?.message ?? "Verification failed");
    },
  });

  if (!email) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-red-500">Invalid verification link</p>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f1f1f1]">
      <div className="w-full max-w-md rounded-2xl border p-8 shadow-lg bg-white">
        <h2 className="mb-4 text-center text-2xl font-bold">Verify OTP</h2>
        <p className="text-center text-sm mb-6 text-gray-500">
          OTP sent to <strong>{email}</strong>
        </p>

        <div className="flex justify-center gap-4 mb-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="w-12 h-12 text-center border border-gray-400 outline-none rounded"
              value={digit}
              onChange={(e) => {
                if (!/^[0-9]?$/.test(e.target.value)) return;
                const newOtp = [...otp];
                newOtp[i] = e.target.value;
                setOtp(newOtp);
              }}
            />
          ))}
        </div>

        {serverError && (
          <p className="text-red-500 text-sm mb-3 text-center">{serverError}</p>
        )}

        <button
          onClick={() => verifyMutation.mutate()}
          disabled={verifyMutation.isPending}
          className="w-full rounded-md bg-black py-2 text-white disabled:opacity-50"
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}