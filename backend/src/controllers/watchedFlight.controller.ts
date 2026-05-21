import type { Request, Response } from "express";
import { watchFlight, getUserWatchedFlights, stopWatchingFlight } from "../services/watchedFlight.service.js";

export async function addWatchedFlight(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const { flightNumber, date } = req.body;
        const result = await watchFlight(userId, flightNumber, new Date(date));
        return res.status(201).json(result);
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
}

export async function getWatchedFlights(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const flights = await getUserWatchedFlights(userId);
        return res.json(flights);
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
}

export async function removeWatchedFlight(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await stopWatchingFlight(userId, id);
        return res.status(204).send();
    } catch (err: any) {
        if (err.message === "WATCHED_FLIGHT_NOT_FOUND") return res.status(404).json({ error: "Volo tracciato non trovato" });
        if (err.message === "FORBIDDEN") return res.status(403).json({ error: "Accesso negato" });
        return res.status(500).json({ error: err.message });
    }
}
