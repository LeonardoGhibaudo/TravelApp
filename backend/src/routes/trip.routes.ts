import Router from "express";
import { createTrip, getMyTrips, getTripsById, createTripStops, updateTripStops, deleteStopById, deleteTripById, updateTripById, inviteToTrip, acceptInvite, removeParticipant, changeTripParticipantRole } from "../controllers/trip.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"




const router = Router();

router.post("/", authMiddleware, createTrip)
router.get("/", authMiddleware, getMyTrips)
router.get("/:tripId", authMiddleware, getTripsById)
router.post("/:tripId/stops", authMiddleware, createTripStops)
router.patch("/:tripId/stops/:stopsId", authMiddleware, updateTripStops)
router.patch("/:tripId", authMiddleware, updateTripById)
router.delete("/:tripId/stops/:stopsId", authMiddleware, deleteStopById)
router.delete("/:tripId", authMiddleware, deleteTripById)
router.post("/:tripId/invite", authMiddleware, inviteToTrip)
router.post("/invite/accept", authMiddleware, acceptInvite)
router.delete("/:tripId/participant/:participantId", authMiddleware, removeParticipant)
router.patch("/:tripId/participant/:participantId/role", authMiddleware, changeTripParticipantRole)


export default router;
