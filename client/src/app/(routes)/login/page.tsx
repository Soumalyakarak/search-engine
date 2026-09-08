"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import GoogleButton from "@/components/google-button";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/api";
import AuthLayout from "@/components/auth/AuthLayout";

type FormData = {
  email: string;
  password: string;
};

type LoginResponse = {
  message: string;
  user: {
    id: string;
    email: string;
  };
};

type ApiError = {
  message?: string;
};

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useMutation<
    LoginResponse,
    AxiosError<ApiError>,
    FormData
  >({
    mutationFn: async (data: FormData) => {
      const response = await api.post<LoginResponse>(
        "/api/auth/login-user",
        data
      );

      return response.data;
    },

    onSuccess: () => {
      setServerError(null);
      router.push("/search");
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ?? "Invalid email or password";

      setServerError(errorMessage);
    },
  });

  const onSubmit = (data: FormData) => {
    setServerError(null);
    loginMutation.mutate(data);
  };

  return (
    <AuthLayout type="login">
      {/* Card */}
      <div className="rounded-3xl border border-[#e5e9ee] bg-white dark:bg-[#121815] /95 p-7 shadow-[0_20px_60px_rgba(30,50,70,0.10)] sm:p-9">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#0b0b0b]">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-[#68758a]">
            Sign in to continue your DSA journey.
          </p>
        </div>

        {/* Google */}
        <div className="mt-7">
          <GoogleButton />
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3 text-xs text-[#98a2b3]">
          <div className="h-px flex-1 bg-[#dfe4ea]" />

          <span className="whitespace-nowrap">or login with email</span>

          <div className="h-px flex-1 bg-[#dfe4ea]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-[#263246]">
                Password
              </label>
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a0b1]"
              />

              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-[#d8dee6] bg-white dark:bg-[#121815]  pl-11 pr-12 text-sm outline-none transition placeholder:text-[#9aa5b5] focus:border-[#18d95b] focus:ring-4 focus:ring-[#18ed63]/10"
                {...register("password", {
                  required: "Password is required",
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

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#56657b] transition hover:text-[#12c951]"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {serverError}
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#111111] text-sm font-semibold text-white transition hover:bg-[#242424] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}

            {!loginMutation.isPending && <span>→</span>}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
