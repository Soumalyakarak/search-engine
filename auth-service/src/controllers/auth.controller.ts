import type { NextFunction, Request, Response } from "express";
import {
  checkOtpRestrictions,
  handleForgotPassword,
  sendOtp,
  trackOtpRequests,
  validateRegistrationData,
  verifyForgotPasswordOtp,
  verifyOtp,
} from "@/utils/auth.helper.js";

import bcrypt from "bcryptjs";
import { AuthError, ValidationError } from "@/middlewares/index.js";
import prisma from "@/lib/prisma.js";
import jwt from "jsonwebtoken";
import { setCookie } from "@/utils/cookies/setCookie.js";
import dotenv from "dotenv";

dotenv.config();

/* ==================================================
   REGISTER (STEP 1 → SEND OTP)
================================================== */
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body);

    const {name,email } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new ValidationError("User already exists!"));
    }

    // Redis guards (will work when uncommented)
    await checkOtpRestrictions(email);
    await trackOtpRequests(email);

    const otp = await sendOtp(name, email, "user-activation-mail");

    res.status(200).json({
      message: "OTP sent successfully",
      otp, // remove in production
    });
  } catch (error) {
    next(error);
  }
};

/* ==================================================
   REGISTER (STEP 2 → VERIFY OTP + CREATE USER)
================================================== */
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return next(new ValidationError("All fields are required!"));
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new ValidationError("User already exists!"));
    }

    await verifyOtp(email, otp);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        isVerified: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    next(error);
  }
};

/* ==================================================
   LOGIN
================================================== */
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Email and password required!"));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new AuthError("User not found!"));
    }

    const isMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isMatch) {
      return next(new AuthError("Invalid credentials"));
    }

    const accessToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    setCookie(res, "access_token", accessToken);
    setCookie(res, "refresh_token", refreshToken);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==================================================
   REFRESH TOKEN
================================================== */
export const refreshToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies["refresh_token"] ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new ValidationError("Unauthorized!"));
    }

    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return next(new AuthError("User not found"));
    }

    const newAccessToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    setCookie(res, "access_token", newAccessToken);

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

/* ==================================================
   GET LOGGED IN USER
================================================== */
export const getUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/* ==================================================
   FORGOT PASSWORD
================================================== */
export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleForgotPassword(req, res,next);
};

/* ==================================================
   VERIFY FORGOT PASSWORD OTP
================================================== */
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await verifyForgotPasswordOtp(req, res,next);
};

/* ==================================================
   RESET PASSWORD
================================================== */
export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newpassword } = req.body;

    if (!email || !newpassword) {
      return next(new ValidationError("Email and new password required!"));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new ValidationError("User not found!"));
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword },
    });

    res.status(200).json({
      message: "Password reset successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// logout
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.status(200).json({ message: "Logged out successfully" });
};

