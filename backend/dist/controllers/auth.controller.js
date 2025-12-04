import { authSignup } from "../services/auth.service.js";
export async function signup(req, res) {
    try {
        const result = await authSignup(req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
