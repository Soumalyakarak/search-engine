import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma.js";

interface JwtPayload {
  id: string;
  role: "user";
}

const isAuthenticated = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    // 1️⃣ Get token (cookie OR Bearer header)
    const token =
      req.cookies?.access_token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized! Token missing.",
      });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;

    if (!decoded?.id) {
      return res.status(401).json({
        message: "Unauthorized! Invalid token.",
      });
    }

    // 3️⃣ Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized! User not found.",
      });
    }

    // 4️⃣ Attach to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized! Token expired or invalid.",
    });
  }
};

export default isAuthenticated;
