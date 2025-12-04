import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../utils/tokens.js";
export async function authSignup(data) {
    const { email, password, name } = data;
    // 1) Validazione
    if (!email || !password || !name) {
        throw new Error("Email, password e name sono obbligatori");
    }
    // 2) Controlla se esiste già un utente con questa email
    const existing = await prisma.user.findUnique({
        where: { email },
    });
    if (existing) {
        throw new Error("Utente già registrato");
    }
    // 3) Hash della password
    const passwordHash = await bcrypt.hash(password, 10);
    // 4) Creazione utente
    const user = await prisma.user.create({
        data: {
            email,
            name,
            passwordHash,
        },
    });
    // 5) Genera refresh token
    const refreshToken = await createRefreshToken(user.id);
    // 6) Genera access token
    const accessToken = createAccessToken(user);
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        accessToken,
        refreshToken,
    };
}
