import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../lib/prisma.js";

const ACCESS_EXPIRE = "15m";
const REFRESH_EXPIRE_DAYS = 30;

const JWT_SECRET = process.env.JWT_SECRET || "7290d577e699ed4f1da03d18a763b1257e3c9af03aa3f5fea57af4ff4b2f262a";

export function createAccessToken(user: { id: string; email: string }) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRE }
  );
}

export async function createRefreshToken(userId: string) {
  const token = crypto.randomUUID();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRE_DAYS);

  await prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}
