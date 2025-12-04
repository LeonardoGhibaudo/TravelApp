import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../lib/prisma.js";
const ACCESS_EXPIRE = "15m";
const REFRESH_EXPIRE_DAYS = 30;
const JWT_SECRET = process.env.JWT_SECRET || "DEV_SECRET_CHANGE_ME";
export function createAccessToken(user) {
    return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: ACCESS_EXPIRE });
}
export async function createRefreshToken(userId) {
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
