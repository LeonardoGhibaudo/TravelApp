import { createTripInvite, tripCreate, getTripsForUser, getTripsDetails, createStops, updateStops, deleteStop, deleteTrip, updateTrip, acceptTripInvite, removeTripParticipant, changeParticipantRole } from "../services/trip.service.js";
import { ZodError } from "zod";
import { createInviteSchema } from "../validators/invite.validator.js";
import { changeParticipantRoleSchema } from "../validators/participant.validator.js";
import { createTripSchema, updateTripSchema } from "../validators/trip.validator.js";
import { createStopSchema, updateStopSchema } from "../validators/stop.validator.js";
export async function createTrip(req, res) {
    try {
        const userId = req.user.id;
        const data = createTripSchema.parse(req.body);
        const result = await tripCreate(userId, data);
        return res.status(201).json(result);
    }
    catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({ err: err.issues });
        }
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
        const data = createStopSchema.parse(req.body);
        const stops = await createStops(userId, tripId, data);
        return res.json(stops);
    }
    catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({ err: err.issues });
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
export async function updateTripStops(req, res) {
    try {
        const userId = req.user.id;
        const { tripId, stopsId } = req.params;
        const data = updateStopSchema.parse(req.body);
        const updatedStop = await updateStops(userId, tripId, stopsId, data);
        return res.json(updatedStop);
    }
    catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({ err: err.issues });
        }
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
        return res.status(204).json({
            "message": "Viaggio eliminato"
        });
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
        return res.status(204).json({
            "message": "Viaggio eliminato"
        });
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
        const data = updateTripSchema.parse(req.body);
        const updatedTrip = await updateTrip(userId, tripId, data);
        return res.json(updatedTrip);
    }
    catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({ err: err.issues });
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
export async function inviteToTrip(req, res) {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email;
        const { tripId } = req.params;
        const data = createInviteSchema.parse(req.body);
        const invite = await createTripInvite(userId, tripId, data.email, data.role);
        return res.json(invite);
    }
    catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({ error: err.issues });
        }
        if (err.message === "TRIP_NOT_FOUND") {
            return res.status(404).json({ error: "Viaggio non trovato" });
        }
        if (err.message === "FORBIDDEN") {
            return res.status(403).json({ error: "Accesso negato" });
        }
        if (err.message === "ALREADY_PARTICIPANT") {
            return res.status(400).json({ error: "Partecipante già esistente" });
        }
        return res.status(500).json({ error: err.message });
    }
}
export async function acceptInvite(req, res) {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email;
        const { token } = req.body;
        const participant = await acceptTripInvite(userId, userEmail, token);
        return res.json(participant);
    }
    catch (err) {
        if (err.message === "INVITE_NOT_FOUND") {
            return res.status(404).json({ error: "Invito non trovato" });
        }
        if (err.message === "EXPIRED") {
            return res.status(400).json({ error: "Invito scaduto" });
        }
        if (err.message === "INVITE_EMAIL_MISMATCH") {
            return res.status(403).json({ error: "Invito non tuo" });
        }
        if (err.message === "ALREADY_PARTICIPANT") {
            return res.status(400).json({ error: "Partecipante già esistente" });
        }
        return res.status(500).json({ error: err.message });
    }
}
export async function removeParticipant(req, res) {
    try {
        const userId = req.user.id;
        const { tripId, participantId } = req.params;
        const result = await removeTripParticipant(userId, tripId, participantId);
        return res.status(200).json(result);
    }
    catch (err) {
        if (err.message === "TRIP_NOT_FOUND") {
            return res.status(404).json({ error: "Viaggio non trovato" });
        }
        if (err.message === "PARTICIPANT_NOT_FOUND") {
            return res.status(404).json({ error: "Partecipante non trovato" });
        }
        if (err.message === "CANNOT_REMOVE_OWNER") {
            return res.status(403).json({ error: "Non puoi rimuovere l'owner" });
        }
        return res.status(500).json({ error: err.message });
    }
}
export async function changeTripParticipantRole(req, res) {
    try {
        const { tripId, participantId } = req.params;
        const userId = req.user.id;
        const data = changeParticipantRoleSchema.parse(req.body);
        const updatedParticipant = await changeParticipantRole(userId, tripId, participantId, data.role);
        return res.status(200).json(updatedParticipant);
    }
    catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({ error: err.issues });
        }
        if (err.message === "INVALID_ROLE") {
            return res.status(400).json({ "error": "Ruolo inserito invalido" });
        }
        if (err.message === "TRIP_NOT_FOUND") {
            return res.status(404).json({ "error": "Viaggio non trovato" });
        }
        if (err.message === "FORBIDDEN") {
            return res.status(403).json({ "error": "Accesso negato" });
        }
        if (err.message === "PARTICIPANT_NOT_FOUND") {
            return res.status(404).json({ "error": "Partecipante non trovato" });
        }
        if (err.message === "CANNOT_CHANGE_OWNER") {
            return res.status(400).json({ "error": "Un owner non può cambiare il suo ruolo" });
        }
        return res.status(500).json({ "error": err.message });
    }
}
