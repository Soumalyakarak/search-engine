"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import GoogleButton from "@/components/google-button";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/api";

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
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <div className="w-full flex justify-center">
        <div className="md:w-120 p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-4">
            Login
          </h3>

          <p className="text-center text-gray-500 mb-4">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </p>

          <GoogleButton />

          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3">or Login with Email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* EMAIL */}
            <label className="block mb-1">Email</label>

            <input
              type="email"
              className="w-full p-2 border rounded mb-2"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}

            {/* PASSWORD */}
            <label className="block mb-1">Password</label>

            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                className="w-full p-2 border rounded mb-2"
                {...register("password", {
                  required: "Password is required",
                })}
              />

              <button
                type="button"
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {passwordVisible ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end mb-3">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-500"
              >
                Forgot Password?
              </Link>
            </div>

            {/* SERVER ERROR */}
            {serverError && (
              <p className="text-red-500 text-sm mb-2 text-center">
                {serverError}
              </p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
            >
              {loginMutation.isPending
                ? "Logging in..."
                : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}