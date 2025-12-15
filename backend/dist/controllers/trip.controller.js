import { tripCreate } from "../services/trip.service.js";
import { getTripsForUser } from "../services/trip.service.js";
import { getTripsDetails } from "../services/trip.service.js";
export async function createTrip(req, res) {
    try {
        const userId = req.user.id;
        const result = await tripCreate(userId, req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
export async function getMyTrips(req, res) {
    try {
        const userId = req.user.id;
        const trips = await getTripsForUser(userId);
        return res.json(trips);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
export async function getTripsById(req, res) {
    try {
        const userId = req.user.id;
        const { tripId } = req.params;
        const trip = await getTripsDetails(userId, tripId);
        return res.json(trip);
    }
    catch (err) {
        if (err.message === "TRIP_NOT_FOUND") {
            return res.status(404).json({ error: "Viaggio non trovato" });
        }
        if (err.message === "FORBIDDEN") {
            return res.status(403).json({ error: "Accesso negato" });
        }
        return res.status(500).json({ error: err.message });
    }
}
