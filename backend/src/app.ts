import express from "express"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js";
import tripRoutes from "./routes/trip.routes.js"
import flightRoutes from "./routes/amadeus.routes.js"
import bookingRoutes from "./routes/booking.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import watchedFlightRoutes from "./routes/watchedFlight.routes.js"
import cors from "cors"


const app = express()


app.use(cors())

app.use(express.json())
app.use("/auth", authRoutes)
app.get("/", (req, res) => {
  res.send("Server attivo!");
});

app.use("/user", userRoutes);
app.use("/trips", tripRoutes);
app.use("/flights", flightRoutes)
app.use("/bookings", bookingRoutes)
app.use("/notifications", notificationRoutes)
app.use("/watched-flights", watchedFlightRoutes)

export default app

