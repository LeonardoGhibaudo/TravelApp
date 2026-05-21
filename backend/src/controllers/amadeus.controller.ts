import { Request, Response } from "express";
import * as amadeusService from "../services/amadeus.service.js"
import prisma from "../lib/prisma.js";

export async function searchFlights(req: Request, res: Response) {
    try {
        console.log("BEFORE FETCH");
        const {originLocationCode, destinationLocationCode, departureDate, returnDate, adults} = req.query;
        if (!originLocationCode || !destinationLocationCode || !departureDate) {
            return res.status(400).json({
                error: "origin, destination and departureDate are required",
            })
        };


        const flights = await amadeusService.searchFlights({
        originLocationCode: originLocationCode as string,
        destinationLocationCode: destinationLocationCode as string,
        departureDate: departureDate as string,
        returnDate: returnDate as string | undefined,
        adults: Number(adults ?? 1)
    });

    console.log("AFTER FETCH")
    return res.json({ flights });
    
    }catch (err:any){
        console.error("Flight search error: ", err)
        return res.status(500).json({"error": err})
    }
}

export async function snapshotFlight(req: Request, res: Response) {
  try {
    const {
      tripId,
      flightNumber,
      airline,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      price,
      currency
    } = req.body;

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

  } catch (err: any) {
    console.error("Snapshot error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getFlightsByTrip(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    const flights = await amadeusService.getFlightsByTrip(req.user.id, tripId);
    return res.json(flights);
  } catch (err: any) {
       if (err.message === "TRIP_NOT_FOUND") {
            return res.status(404).json({ error: "Viaggio non trovato" })
        }
        if (err.message === "FORBIDDEN") {
            return res.status(403).json({ error: "Accesso negato" })
        }
        return res.status(500).json({ error: err.message })
  }
}