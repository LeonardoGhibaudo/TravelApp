import prisma from '../lib/prisma.js'

export async function checkTripAccess(userId: string, tripId: string) {
    const trip = await prisma.trip.findUnique({
        where: { id: tripId }
    })

    if (!trip) {
        throw new Error("TRIP_NOT_FOUND");
    }

    if (trip.ownerId === userId) {
        return {
            role: "OWNER",
            trip,
            participant: null
        }
    }

    const participant = await prisma.tripParticipant.findUnique({
        where: {
            tripId_userId: {
                tripId,
                userId
            }
        }
    })

    if (!participant) {
        throw new Error("FORBIDDEN");
    }

    return {
        role: participant.role === "EDITOR" ? "EDITOR" : "VIEWER",
        trip,
        participant
    }
}
