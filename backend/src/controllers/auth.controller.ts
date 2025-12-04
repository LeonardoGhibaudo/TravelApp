import type { Request, Response } from "express";
import { authSignup } from "../services/auth.service.js";

export async function signup(req: Request, res: Response) {
  try {
    const result = await authSignup(req.body);
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
