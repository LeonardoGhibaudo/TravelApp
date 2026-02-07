import * as amadeusService from "../services/amadeus.service.js";
export async function searchFlights(req, res) {
    try {
        const { originLocationCode, destinationLocationCode, departureDate, returnDate, adults } = req.query;
        if (!originLocationCode || !destinationLocationCode || !departureDate) {
            return res.status(400).json({
                error: "origin, destination and departureDate are required",
            });
            const flights = await amadeusService.searchFlights({
                originLocationCode: originLocationCode,
                destinationLocationCode: destinationLocationCode,
                departureDate: departureDate,
                returnDate: returnDate,
                adults: Number(adults ?? 1)
            });
            return res.json({ flights });
        }
    }
    catch (err) {
        console.error("Flight search error: ", err);
        return res.status(500).json({ "error": err });
    }
}
