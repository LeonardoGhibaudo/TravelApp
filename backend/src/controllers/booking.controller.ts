import type { Request, Response } from "express";
import { createBooking, getUserBookings, cancelBooking } from "../services/booking.service.js";

export async function makeBooking(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const { flightId, passengerName } = req.body;
        const booking = await createBooking(userId, flightId, passengerName);
        return res.status(201).json(booking);
    } catch (err: any) {
        if (err.message === "FLIGHT_NOT_FOUND") return res.status(404).json({ error: "Volo non trovato" });
        return res.status(500).json({ error: err.message });
    }
}

export async function getBookings(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const bookings = await getUserBookings(userId);
        return res.json(bookings);
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
}

export async function cancelUserBooking(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const { bookingId } = req.params;
        const booking = await cancelBooking(userId, bookingId);
        return res.json(booking);
    } catch (err: any) {
        if (err.message === "BOOKING_NOT_FOUND") return res.status(404).json({ error: "Prenotazione non trovata" });
        if (err.message === "FORBIDDEN") return res.status(403).json({ error: "Accesso negato" });
        return res.status(500).json({ error: err.message });
    }
}
