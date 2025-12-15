import express from "express"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js";
import tripRoutes from "./routes/trip.routes.js"
import cors from "cors"


const app = express()


app.use(cors())

app.use(express.json())
app.use("/auth", authRoutes)
app.get("/", (req, res) => {
  res.send("Server attivo!");
});

app.use("/user", userRoutes);
app.use("/trips", tripRoutes)

export default app
