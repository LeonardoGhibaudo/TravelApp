import prisma from "../lib/prisma.js";
import { checkTripAccess } from "./tripAccess.service.js";

export async function tripCreate(userId: string, data: any) {
    const { name, destination, startDate, endDate } = data;

    if(!name || !destination || !startDate || !endDate) {
        throw new Error("Missing required fields");
    }

    const trip = await prisma.trip.create({
        data: {
            name,
            destination,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            ownerId: userId
        }
    })
    return trip;
}


export async function getTripsForUser(userId: string, ) {
    const tripOwned = await prisma.trip.findMany({
        where: {
            ownerId: userId
        },
        select : {
            id: true,
            name: true,
            destination: true
        }
    })

    const tripParticipant = await prisma.tripParticipant.findMany({
        where: {
            userId
        },
        include: {
            trip: {
                select: {
                    id: true,
                    name: true,
                    destination: true
                }
            }
        }
    })

    const tripsOwned = tripOwned.map(trip => ({
        ...trip,
        role: "OWNER"
    }))

    const tripAsParticipant = tripParticipant.map(p => ({
        id: p.trip.id,
        name: p.trip.name,
        destination: p.trip.destination,
        role: p.role
    }))

    return [...tripsOwned, ...tripAsParticipant]
}


export async function getTripsDetails(userId: string, tripId: string) {
    const {role, trip} = await checkTripAccess(userId, tripId)

    const tripStops = await prisma.tripStop.findMany({
        where: {tripId},
        orderBy: {orderIndex: "asc"}
    })

    const participants = await prisma.tripParticipant.findMany({
        where: {tripId},
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true
                }
            }
        }
    })

    return {
        id: trip.id,
        name: trip.name,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        role,
        tripStops,
        participants,
    }
}
