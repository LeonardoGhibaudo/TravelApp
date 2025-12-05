import { Request, Response,  NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "7290d577e699ed4f1da03d18a763b1257e3c9af03aa3f5fea57af4ff4b2f262a";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
                return res.status(401).json({error: "Token Mancante"});
        }


        const token = authHeader.split(" ")[1];

        const payload = jwt.verify(token, JWT_SECRET) as {
            sub: string,
            email: string;
        };
        req.user = {
            id: payload.sub,
            email: payload.email
        }
        return next();
        } catch (err){
            return res.status(401).json({error: "Token non valido"})
        }
    }
