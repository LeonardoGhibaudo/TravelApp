import { Request, Response } from "express";
import * as amadeusService from "../services/amadeus.service.js"

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
