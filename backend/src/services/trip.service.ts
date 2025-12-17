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


export async function createStops(userId: string, tripId: string, data: any) {
    const { title, location, plannedTime } = data

    if(!title || !plannedTime){
        throw new Error("Missing required fields");
    }

    const { role } = await checkTripAccess(userId, tripId)

    if(role === "VIEWER"){
        throw new Error("FORBIDDEN");
    }

    const lastStop = await prisma.tripStop.findFirst({
        where: { tripId },
        orderBy: { orderIndex: "desc" }

    })

    const nextOrderIndex = lastStop ? lastStop.orderIndex + 1 : 0


    return prisma.tripStop.create({
        data: {
            tripId,
            title,
            location,
            plannedTime: new Date(plannedTime),
            orderIndex: nextOrderIndex
        }
    })
}

export async function updateStops(userId: string, tripId: string, stopId: string, data: any) {
    const { title, location, plannedTime } = data

    const { role } = await checkTripAccess(userId, tripId)

    if(role === "VIEWER"){
        throw new Error("FORBIDDEN");
    };

    const stop = await prisma.tripStop.findUnique({
        where : { id: stopId}
    })

    if(!stop || stop.tripId !== tripId ){
        throw new Error("STOP_NOT_FOUND");
    }
    return prisma.tripStop.update({
    where: { id: stopId },
    data: {
      title: data.title ?? stop.title,
      location: data.location ?? stop.location,
      plannedTime: data.plannedTime ? new Date(data.plannedTime) : stop.plannedTime
    }
  });
}
