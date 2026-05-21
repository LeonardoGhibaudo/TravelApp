import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { makeBooking, getBookings, cancelUserBooking } from "../controllers/booking.controller.js";

const router = Router();

router.post("/", authMiddleware, makeBooking);
router.get("/", authMiddleware, getBookings);
router.delete("/:bookingId", authMiddleware, cancelUserBooking);

export default router;
