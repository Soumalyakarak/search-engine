"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import GoogleButton from "@/components/google-button";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/api";
import AuthLayout from "@/components/auth/AuthLayout";

type FormData = {
  name: string;
  email: string;
  password: string;
};

type ApiResponse = {
  message: string;
  success?: boolean;
  otp?: string;
};

type ApiError = {
  message?: string;
};

export default function Signup() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);

  const [otp, setOtp] = useState(["", "", "", ""]);

  const [userData, setUserData] = useState<FormData | null>(null);

  const [serverError, setServerError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  /* =========================================================
     RESEND TIMER
  ========================================================= */

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

  /* =========================================================
     SIGNUP
  ========================================================= */

  const signupMutation = useMutation<
    ApiResponse,
    AxiosError<ApiError>,
    FormData
  >({
    mutationFn: async (data: FormData) => {
      const response = await api.post<ApiResponse>(
        "/api/auth/user-registration",
        data
      );

      return response.data;
    },

    onSuccess: (_, formData) => {
      setUserData(formData);

      setShowOtp(true);

      setCanResend(false);

      setTimer(60);

      setServerError(null);

      startResendTimer();
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ?? "Signup failed. Please try again!";

      setServerError(errorMessage);
    },
  });

  /* =========================================================
     VERIFY OTP
  ========================================================= */

  const verifyOtpMutation = useMutation<ApiResponse, AxiosError<ApiError>>({
    mutationFn: async () => {
      if (!userData) {
        throw new Error("User data missing");
      }

      const response = await api.post<ApiResponse>("/api/auth/verify-user", {
        ...userData,
        otp: otp.join(""),
      });

      return response.data;
    },

    onSuccess: () => {
      setServerError(null);

      router.push("/login");
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ?? "OTP verification failed!";

      setServerError(errorMessage);
    },
  });

  /* =========================================================
     SUBMIT
  ========================================================= */

  const onSubmit = (data: FormData) => {
    setServerError(null);

    signupMutation.mutate(data);
  };

  /* =========================================================
     OTP CHANGE
  ========================================================= */

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* =========================================================
     OTP KEYBOARD
  ========================================================= */

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* =========================================================
     RESEND
  ========================================================= */

  const resendOtp = () => {
    if (userData) {
      signupMutation.mutate(userData);
    }
  };

  return (
    <AuthLayout type="signup">
      <div className="rounded-3xl border border-[#e5e9ee] bg-white dark:bg-[#121815] /95 p-7 shadow-[0_20px_60px_rgba(30,50,70,0.10)] sm:p-9">
        {!showOtp ? (
          <>
            {/* =================================================
                SIGNUP FORM
            ================================================== */}

            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-[#0b0b0b]">
                Create your account
              </h1>

              <p className="mt-2 text-sm text-[#68758a]">
                Join DSA Search and take your problem-solving skills to the next
                level.
              </p>
            </div>

            {/* Google */}
            <div className="mt-7">
              <GoogleButton />
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3 text-xs text-[#98a2b3]">
              <div className="h-px flex-1 bg-[#dfe4ea]" />

              <span className="whitespace-nowrap">or sign up with email</span>

              <div className="h-px flex-1 bg-[#dfe4ea]" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#263246]">
                  Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a0b1]"
                  />

                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="h-12 w-full rounded-xl border border-[#d8dee6] bg-white dark:bg-[#121815]  pl-11 pr-4 text-sm outline-none transition placeholder:text-[#9aa5b5] focus:border-[#18d95b] focus:ring-4 focus:ring-[#18ed63]/10"
                    {...register("name", {
                      required: "Name is required",
                    })}
                  />
                </div>

                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#263246]">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a0b1]"
                  />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 w-full rounded-xl border border-[#d8dee6] bg-white dark:bg-[#121815]  pl-11 pr-4 text-sm outline-none transition placeholder:text-[#9aa5b5] focus:border-[#18d95b] focus:ring-4 focus:ring-[#18ed63]/10"
                    {...register("email", {
                      required: "Email is required",

                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#263246]">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a0b1]"
                  />

                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Create a password (min. 6 characters)"
                    className="h-12 w-full rounded-xl border border-[#d8dee6] bg-white dark:bg-[#121815]  pl-11 pr-12 text-sm outline-none transition placeholder:text-[#9aa5b5] focus:border-[#18d95b] focus:ring-4 focus:ring-[#18ed63]/10"
                    {...register("password", {
                      required: "Password is required",

                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setPasswordVisible((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a0b1] transition hover:text-[#293548]"
                  >
                    {passwordVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Error */}
              {serverError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                  {serverError}
                </div>
              )}

              {/* Signup button */}
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#18c95a] text-sm font-semibold text-white shadow-sm transition hover:bg-[#12b950] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {signupMutation.isPending ? "Sending OTP..." : "Sign Up →"}
              </button>

              {/* Terms */}
              <p className="px-4 text-center text-xs leading-5 text-[#8792a3]">
                By creating an account, you agree to our{" "}
                <span className="font-medium text-[#12b950]">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="font-medium text-[#12b950]">
                  Privacy Policy
                </span>
                .
              </p>
            </form>
          </>
        ) : (
          <>
            {/* =================================================
                OTP
            ================================================== */}

            <button
              type="button"
              onClick={() => {
                setShowOtp(false);
                setServerError(null);
              }}
              className="mb-6 flex items-center gap-2 text-sm font-medium text-[#68758a] transition hover:text-[#111111]"
            >
              <ArrowLeft size={16} />
              Back to signup
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dffbe9]">
                <Mail size={25} className="text-[#13cf52]" />
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#0b0b0b]">
                Verify your email
              </h1>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#68758a]">
                We&apos;ve sent a 4-digit verification code to your email address.
              </p>

              {userData?.email && (
                <p className="mt-2 text-sm font-semibold text-[#263246]">
                  {userData.email}
                </p>
              )}
            </div>

            {/* OTP inputs */}
            <div className="mt-8 flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="h-14 w-14 rounded-xl border border-[#d8dee6] bg-white dark:bg-[#121815]  text-center text-xl font-semibold text-[#111111] outline-none transition focus:border-[#18d95b] focus:ring-4 focus:ring-[#18ed63]/10"
                />
              ))}
            </div>

            {/* Error */}
            {serverError && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                {serverError}
              </div>
            )}

            {/* Verify */}
            <button
              type="button"
              disabled={
                verifyOtpMutation.isPending || otp.join("").length !== 4
              }
              onClick={() => verifyOtpMutation.mutate()}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#18c95a] text-sm font-semibold text-white transition hover:bg-[#12b950] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify Email →"}
            </button>

            {/* Resend */}
            <div className="mt-5 text-center text-sm">
              {canResend ? (
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={signupMutation.isPending}
                  className="font-semibold text-[#12b950] transition hover:text-[#0d9e42] disabled:opacity-50"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-[#7d899a]">
                  Resend OTP in{" "}
                  <span className="font-semibold text-[#263246]">{timer}s</span>
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
