import axios from "axios"

import { checkTripAccess } from "./tripAccess.service";
import prisma from "../lib/prisma";

const AMADEUS_CLIENT_ID = process.env.AMADEUS_API_KEY!;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_API_SECRET!;
const AMADEUS_BASE_URL = "https://test.api.amadeus.com"

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (accessToken && now < tokenExpiresAt) {
    return accessToken
  }

  const response = await axios.post(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, new URLSearchParams({
    grant_type: "client_credentials",
    client_id: AMADEUS_CLIENT_ID,
    client_secret: AMADEUS_CLIENT_SECRET
  }).toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  )

  accessToken = response.data.access_token
  tokenExpiresAt = now + response.data.expires_in * 1000 - 10000; // 10s di margine

  if (!accessToken) {
    throw new Error("Failed to retrieve access token from Amadeus");
  }

  return accessToken;
}
export type flightData = {
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  currency: string;
  duration: string;
};
export async function searchFlights(params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
}): Promise<flightData[]> {
  const token = await getAccessToken();

  // Costruisci i params in modo pulito, senza duplicati
  // e senza mandare undefined ad Amadeus
  const queryParams: Record<string, any> = {
    originLocationCode: params.originLocationCode,
    destinationLocationCode: params.destinationLocationCode,
    departureDate: params.departureDate,
    adults: params.adults ?? 1,
    max: 10,
  };

  // returnDate lo aggiungi SOLO se esiste — mai mandare undefined
  if (params.returnDate) {
    queryParams.returnDate = params.returnDate;
  }

  const response = await axios.get(
    `${AMADEUS_BASE_URL}/v2/shopping/flight-offers`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: queryParams,
      timeout: 5000,
    }
  );

  return response.data.data.map((offer: any) => {
    const itinerary = offer.itineraries[0];
    const firstSegment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];
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

 export async function flightSnapshot(this: any,  data: {
  offerId: string;
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  currency: string;
  duration: string;
  tripId: string;
 }){
    return this.prisma.flight.create({
      data: {
        offerId: data.offerId,
        flightNumber: data.flightNumber,
        airline: data.airline,
        departureAirport: data.departureAirport,
        arrivalAirport: data.arrivalAirport,
        departureTime: data.departureTime,
        arrivalTime: data.arrivalTime,
        price: data.price,
        currency: data.currency,
        duration: data.duration,
        tripId: data.tripId,
      },
    });
 }


 export async function getFlightsByTrip(userId: string, tripId: string) {
    await checkTripAccess(userId, tripId)

    const flights = await prisma.flight.findMany({
      where: { tripId },
      orderBy: { departureTime: "asc" }
    })

    return flights

  
 }
