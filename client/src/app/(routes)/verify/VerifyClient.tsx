"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/api";

type ApiError = { message?: string };

export default function VerifyClient() {
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
      setServerError(
        error.response?.data?.message ?? "Verification failed"
      );
    },
  });

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Invalid verification link</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8f8] dark:bg-[#0b0f0d]">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-lg dark:bg-[#121815]">
        <h2 className="mb-4 text-center text-2xl font-bold">
          Verify OTP
        </h2>

        <p className="mb-6 text-center text-sm text-gray-500 dark:text-[#9aa7a0]">
          OTP sent to <strong>{email}</strong>
        </p>

        <div className="mb-4 flex justify-center gap-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="h-12 w-12 rounded border border-gray-400 text-center outline-none"
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
          <p className="mb-3 text-center text-sm text-red-500">
            {serverError}
          </p>
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