import { Router } from "express";
import { searchFlights, snapshotFlight } from "../controllers/amadeus.controller.js";
const router = Router();
router.get("/search", searchFlights);
router.post("/snapshot", snapshotFlight);
export default router;
