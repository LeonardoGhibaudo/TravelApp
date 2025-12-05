import { authSignup } from "../services/auth.service.js";
import { authLogin } from "../services/auth.service.js";
import { authRefresh } from "../services/auth.service.js";
import { authLogout } from "../services/auth.service.js";
export async function signup(req, res) {
    try {
        const result = await authSignup(req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
export async function login(req, res) {
    try {
        const result = await authLogin(req.body);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
export async function refresh(req, res) {
    try {
        const result = await authRefresh(req.body.refreshToken);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(401).json({ error: err.message });
    }
}
export async function logout(req, res) {
    try {
        const { refreshToken } = req.body;
        const result = await authLogout(refreshToken);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
