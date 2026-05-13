"use client";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import GoogleButton from "@/components/google-button";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/api";

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

  const signupMutation = useMutation<ApiResponse, AxiosError<ApiError>, FormData>(
    {
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
    }
  );

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

  const onSubmit = (data: FormData) => {
    signupMutation.mutate(data);
  };

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

  const resendOtp = () => {
    if (userData) {
      signupMutation.mutate(userData);
    }
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <div className="w-full flex justify-center">
        <div className="md:w-120 p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-4">
            Sign Up
          </h3>

          <p className="text-center text-gray-500 mb-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </p>

          <GoogleButton />

          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3">or Sign Up with Email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {!showOtp ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Soumalya"
                className="w-full p-2 border border-gray-300 rounded mb-1 outline-0"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}

              <label className="block text-gray-700 mb-1 mt-3">Email</label>
              <input
                type="email"
                placeholder="support@Bcart.com"
                className="w-full p-2 border border-gray-300 rounded mb-1 outline-0"
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
                  {errors.email.message}
                </p>
              )}

              <label className="block text-gray-700 mb-1 mt-3">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  className="w-full p-2 border border-gray-300 rounded mb-1 outline-0"
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

              {serverError && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full text-lg cursor-pointer mt-4 bg-black text-white py-2 rounded-lg disabled:opacity-50"
              >
                {signupMutation.isPending ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-center mb-4">
                Enter OTP
              </h3>

              <div className="flex justify-center gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-400 outline-none rounded"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="w-full mt-4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50"
                disabled={verifyOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </button>

              <p className="text-center text-sm mt-4">
                {canResend ? (
                  <button
                    onClick={resendOtp}
                    className="text-blue-500 cursor-pointer"
                    type="button"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span>{`Resend OTP in ${timer}s`}</span>
                )}
              </p>

              {serverError && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {serverError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}