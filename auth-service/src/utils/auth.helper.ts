import crypto from "crypto";
import { ValidationError } from "@/middlewares/index.js";
import redis from "@/lib/redis.js";
import { sendEmail } from "./sendMail/index.js";
import type { NextFunction, Request, Response } from "express";
import prisma from "@/lib/prisma.js";

/* =====================================================
   EMAIL VALIDATION
===================================================== */

const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateRegistrationData = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw new ValidationError("Missing required fields!");
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format!");
  }
};

/* =====================================================
   OTP LOCK CHECK
===================================================== */

export const checkOtpRestrictions = async (email: string) => {
  if (await redis.get(`otp_lock:${email}`)) {
    throw new ValidationError(
      "Account locked due to multiple failed attempts! Try again after 30 minutes"
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    throw new ValidationError(
      "Too many OTP requests! Please wait 1 hour before requesting again"
    );
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    throw new ValidationError(
      "Please wait 1 minute before requesting a new OTP!"
    );
  }
};

/* =====================================================
   OTP REQUEST RATE LIMITING
===================================================== */

export const trackOtpRequests = async (email: string) => {
  const otpRequestKey = `otp_request_count:${email}`;
  const otpRequests = parseInt(
    (await redis.get(otpRequestKey)) || "0"
  );

  if (otpRequests >= 3) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600); // 1 hour
    throw new ValidationError(
      "Too many OTP requests. Please wait 1 hour before requesting again."
    );
  }

  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600);
};

/* =====================================================
   SEND OTP
===================================================== */

export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();

  await sendEmail(email, "Verify Your Email", template, { name, otp });

  await redis.set(`otp:${email}`, otp, "EX", 300);
};


/* =====================================================
   VERIFY OTP
===================================================== */

export const verifyOtp = async (email: string, otp: string) => {
  const storedOtp = await redis.get(`otp:${email}`);

  if (!storedOtp) {
    throw new ValidationError("Invalid or expired OTP!");
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt(
    (await redis.get(failedAttemptsKey)) || "0"
  );

  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800);
      await redis.del(`otp:${email}`, failedAttemptsKey);

      throw new ValidationError(
        "Too many failed attempts. Account locked for 30 minutes."
      );
    }

    await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);

    throw new ValidationError(
      `Incorrect OTP. ${2 - failedAttempts} attempts left.`
    );
  }

  await redis.del(`otp:${email}`, failedAttemptsKey);
};

/* =====================================================
   FORGOT PASSWORD
===================================================== */

export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      throw new ValidationError("Email is required!");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ValidationError("User not found!");
    }

    await checkOtpRestrictions(email);
    await trackOtpRequests(email);
    await sendOtp(name, email, "user-activation-mail");


    res.status(200).json({
      message: "OTP sent to email. Please verify.",
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   VERIFY FORGOT PASSWORD OTP
===================================================== */

export const verifyForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new ValidationError("Email and OTP are required!");
    }

    await verifyOtp(email, otp);

    res.status(200).json({
      message: "OTP verified. You can now reset your password.",
    });
  } catch (error) {
    next(error);
  }
};
