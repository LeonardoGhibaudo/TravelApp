import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function watchFlight(userId: string, flightNumber: string, date: Date) {
    return await prisma.watchedFlight.create({
        data: {
            userId,
            flightNumber,
            date
        }
    });
}

export async function getUserWatchedFlights(userId: string) {
    return await prisma.watchedFlight.findMany({
        where: { userId }
    });
}

export async function stopWatchingFlight(userId: string, watchedFlightId: string) {
    const wf = await prisma.watchedFlight.findUnique({ where: { id: watchedFlightId } });
    if (!wf) throw new Error("WATCHED_FLIGHT_NOT_FOUND");
    if (wf.userId !== userId) throw new Error("FORBIDDEN");

    return await prisma.watchedFlight.delete({
        where: { id: watchedFlightId }
    });
}
