import * as amadeusService from "../services/amadeus.service.js";
import prisma from "../lib/prisma.js";
export async function searchFlights(req, res) {
    try {
        console.log("BEFORE FETCH");
        const { originLocationCode, destinationLocationCode, departureDate, returnDate, adults } = req.query;
        if (!originLocationCode || !destinationLocationCode || !departureDate) {
            return res.status(400).json({
                error: "origin, destination and departureDate are required",
            });
        }
        ;
        const flights = await amadeusService.searchFlights({
            originLocationCode: originLocationCode,
            destinationLocationCode: destinationLocationCode,
            departureDate: departureDate,
            returnDate: returnDate,
            adults: Number(adults ?? 1)
        });
        console.log("AFTER FETCH");
        return res.json({ flights });
    }
    catch (err) {
        console.error("Flight search error: ", err);
        return res.status(500).json({ "error": err });
    }
}
export async function snapshotFlight(req, res) {
    try {
        const { tripId, flightNumber, airline, departureAirport, arrivalAirport, departureTime, arrivalTime, price, currency } = req.body;
        if (!tripId || !flightNumber || !departureAirport || !arrivalAirport) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }
        const flight = await prisma.flight.create({
            data: {
                tripId,
                flightNumber,
                airline,
                departureAirport,
                arrivalAirport,
                departureTime: new Date(departureTime),
                arrivalTime: new Date(arrivalTime),
                price,
                currency,
                status: "SELECTED"
            }
        });
        return res.status(201).json(flight);
    }
    catch (err) {
        console.error("Snapshot error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
