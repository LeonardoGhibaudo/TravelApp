import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../utils/tokens.js";
import { create } from "domain";
import { PassThrough } from "stream";

type SignupInput = {
  email: string;
  password: string;
  name: string;
};

export async function authSignup(data: SignupInput) {
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

export async function authLogin(data: {email: string; password: string}) {
  const {email, password} = data;
  if(!email || !password) {
    throw new Error("Email e password sono obbligatorie");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if(!user){
    throw new Error("USER_NON_EXISTENT");
  }

  const comparePassword = await bcrypt.compare(password, user.passwordHash);

  if(!comparePassword){
    throw new Error("Credenziali non valide");
  }

  const accessToken = createAccessToken(user)
  const refreshToken = await createRefreshToken(user.id)

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    accessToken,
    refreshToken
  };
};


export async function authRefresh(refreshToken: string) {
  if (!refreshToken){
    throw new Error("Refresh token non valido");
  }

  const dbToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!dbToken){
    throw new Error("Refresh token non valido");
  }

  if(dbToken.expiresAt < new Date()){
    throw new Error("Refresh token scaduto");
  }

  const user = dbToken.user;
  const accessToken = createAccessToken(user);

  return{
    accessToken
  }
}
export async function authLogout(refreshToken: string) {
    if(!refreshToken){
      throw new Error("Refresh token non valido");
    }

    const dbToken = await prisma.refreshToken.findUnique({
        where: {token: refreshToken}
    })

    if(!dbToken){
      throw new Error("Refresh token non valido");
    }

    await prisma.refreshToken.delete({
      where: {token: refreshToken}
    })

    return {
      message: "logout effettuato con successo!"
    }
}
