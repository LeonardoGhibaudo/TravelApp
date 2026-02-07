import axios from "axios";
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
const AMADEUS_BASE_URL = "https://test.api.amadeus.com";
let accessToken = null;
let tokenExpiresAt = 0;
async function getAccessToken() {
    const now = Date.now();
    if (accessToken && now < tokenExpiresAt) {
        return accessToken;
    }
    const response = await axios.post('$AMADEUS_BASE_URL/v1/security/oauth2/token', new URLSearchParams({
        grant_type: "client_credentials",
        client_id: AMADEUS_CLIENT_ID,
        client_secret: AMADEUS_CLIENT_SECRET
    }).toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    accessToken = response.data.access_token;
    tokenExpiresAt = now + response.data.expires_in * 1000 - 10000; // 10s di margine
    if (!accessToken) {
        throw new Error("Failed to retrieve access token from Amadeus");
    }
    return accessToken;
}
export async function searchFlights(params) {
    const token = getAccessToken();
    const query = {
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        adults: params.adults || 1,
        nonStop: false,
        max: 10
    };
    if (params.returnDate)
        query.returnDate = params.returnDate;
    const response = await axios.get(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            originLocationCode: params.originLocationCode,
            destinationLocationCode: params.destinationLocationCode,
            departureDate: params.departureDate,
            returnDate: params.returnDate,
            adults: params.adults ?? 1,
            max: 10,
        },
    });
    return response.data.data.map((offer) => {
        const itinerary = offer.itineraries[0];
        const firstSegment = offer.segments[0];
        const lastSegment = offer.itinerary.segments[itinerary.segments.length - 1];
        return {
            flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
            airline: firstSegment.carrierCode,
            departureAirport: firstSegment.departure.iataCode,
            arrivalAirport: lastSegment.arrival.iataCode,
            departureTime: firstSegment.departure.at,
            arrivalTime: lastSegment.arrival.at,
            price: Number(offer.price.total),
            currency: offer.price.currency,
            duration: itinerary.duration,
        };
    });
}
