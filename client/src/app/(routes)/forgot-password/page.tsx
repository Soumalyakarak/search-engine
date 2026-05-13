"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

type EmailForm = {
  email: string;
};

type PasswordForm = {
  password: string;
};

type ApiResponse = {
  message: string;
  success?: boolean;
};

type ApiError = {
  message?: string;
};

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [serverError, setServerError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm & PasswordForm>();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const requestOtpMutation = useMutation<ApiResponse, AxiosError<ApiError>, EmailForm>({
    mutationFn: async ({ email }: EmailForm) => {
      const response = await api.post("/api/auth/forgot-password-user", {
        email,
      });
      return response.data;
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep("otp");
      setServerError(null);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ?? "Failed to send OTP. Try again!";
      setServerError(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation<ApiResponse, AxiosError<ApiError>>({
    mutationFn: async () => {
      if (!userEmail) throw new Error("Email is missing");

      const response = await api.post("/api/auth/verify-forgot-password-user", {
        email: userEmail,
        otp: otp.join(""),
      });

      return response.data;
    },
    onSuccess: () => {
      setStep("reset");
      setServerError(null);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ?? "Invalid OTP. Try again!";
      setServerError(errorMessage);
    },
  });

  const resetPasswordMutation = useMutation<
    ApiResponse,
    AxiosError<ApiError>,
    PasswordForm
  >({
    mutationFn: async ({ password }: PasswordForm) => {
      if (!userEmail) throw new Error("Email is missing");

      const response = await api.post("/api/auth/reset-password-user", {
        email: userEmail,
        newpassword: password,
      });

      return response.data;
    },
    onSuccess: () => {
      setStep("email");
      toast.success(
        "Password reset successfully! Please login with your new password."
      );
      setServerError(null);
      router.push("/login");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ?? "Failed to reset password!";
      setServerError(errorMessage);
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmitEmail = ({ email }: EmailForm) => {
    requestOtpMutation.mutate({ email });
  };

  const onSubmitPassword = ({ password }: PasswordForm) => {
    resetPasswordMutation.mutate({ password });
  };

  return (
    <div className="w-full py-10 min-h-[85h] bg-[#f1f1f1]">
      <h1 className="text-4xl font-poppons font-semibold text-black text-center">
        Forgot Password
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Forgot-password
      </p>

      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          {step === "email" && (
            <>
              <h3 className="text-3xl font-semibold text-center mb-2">
                Forgot Password
              </h3>
              <p className="text-center text-gray-500 mb-4">
                Go back to?{" "}
                <Link href="/login" className="text-blue-500">
                  Login
                </Link>
              </p>

              <form onSubmit={handleSubmit(onSubmitEmail)}>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="support@Bcart.com"
                  className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email adress",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {String(errors.email.message)}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={requestOtpMutation.isPending}
                  className="w-full text-lg cursor-pointer mt-4 bg-black text-white py-2 rounded-lg disabled:opacity-50"
                >
                  {requestOtpMutation.isPending ? "sending OTP..." : "Submit"}
                </button>

                {serverError && (
                  <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <h3 className="text-xl font-semibold text-center mb-4">
                Enter Otp
              </h3>

              <div className="flex justify-center gap-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-400 outline-none !rounded"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full mt-4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50"
                disabled={verifyOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
              >
                {verifyOtpMutation.isPending ? "...Verifying" : "Verify OTP"}
              </button>

              <p className="text-center text-sm mt-4">
                {canResend ? (
                  <button
                    onClick={() => {
                      if (userEmail) requestOtpMutation.mutate({ email: userEmail });
                    }}
                    className="text-blue-500 text-center mt-4 cursor-pointer"
                  >
                    Resend Otp
                  </button>
                ) : (
                  <span>{`Resend OTP in ${timer}s`}</span>
                )}
              </p>

              {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
              )}
            </>
          )}

          {step === "reset" && (
            <>
              <h3 className="text-xl font-semibold text-center mb-4">
                Reset Password
              </h3>

              <form onSubmit={handleSubmit(onSubmitPassword)}>
                <label className="block text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  className="w-full p-2 border-gray-300 outline-0 !rounded mb-1"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {String(errors.password.message)}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg disabled:opacity-50"
                >
                  {resetPasswordMutation.isPending
                    ? "Resetting"
                    : "Reset Password"}
                </button>

                {serverError && (
                  <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}