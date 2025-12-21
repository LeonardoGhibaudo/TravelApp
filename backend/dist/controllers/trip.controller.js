import { tripCreate } from "../services/trip.service.js";
import { getTripsForUser } from "../services/trip.service.js";
import { getTripsDetails } from "../services/trip.service.js";
import { createStops } from "../services/trip.service.js";
import { updateStops } from "../services/trip.service.js";
import { deleteStop } from "../services/trip.service.js";
import { deleteTrip } from "../services/trip.service.js";
import { updateTrip } from "../services/trip.service.js";
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
export async function createTripStops(req, res) {
    try {
        const userId = req.user.id;
        const { tripId } = req.params;
        const stops = await createStops(userId, tripId, req.body);
        return res.json(stops);
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
export async function updateTripStops(req, res) {
    try {
        const userId = req.user.id;
        const { tripId, stopsId } = req.params;
        const updatedStop = await updateStops(userId, tripId, stopsId, req.body);
        return res.json(updatedStop);
    }
    catch (err) {
        if (err.message === "STOP_NOT_FOUND") {
            return res.status(404).json({ error: "Stop non trovata" });
        }
        if (err.message === "TRIP_NOT_FOUND") {
            return res.status(404).json({ error: "Viaggio non trovato" });
        }
        if (err.message === "FORBIDDEN") {
            return res.status(403).json({ error: "Accesso negato" });
        }
        return res.status(500).json({ error: err.message });
    }
}
export async function deleteStopById(req, res) {
    try {
        const userId = req.user.id;
        const { tripId, stopsId } = req.params;
        await deleteStop(userId, tripId, stopsId);
        return res.status(204).send();
    }
    catch (err) {
        if (err.message === "STOP_NOT_FOUND") {
            return res.status(404).json({ error: "Stop non trovata" });
        }
        if (err.message === "TRIP_NOT_FOUND") {
            return res.status(404).json({ error: "Viaggio non trovato" });
        }
        if (err.message === "FORBIDDEN") {
            return res.status(403).json({ error: "Accesso negato" });
        }
        return res.status(500).json({ error: err.message });
    }
}
export async function deleteTripById(req, res) {
    try {
        const userId = req.user.id;
        const { tripId } = req.params;
        await deleteTrip(userId, tripId);
        return res.status(204).send();
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
export async function updateTripById(req, res) {
    try {
        const userId = req.user.id;
        const { tripId } = req.params;
        const updatedTrip = await updateTrip(userId, tripId, req.body);
        return res.json(updatedTrip);
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
