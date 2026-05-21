import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createBooking(userId: string, flightId: string, passengerName: string) {
    const flight = await prisma.flight.findUnique({ where: { id: flightId } });
    if (!flight) throw new Error("FLIGHT_NOT_FOUND");

    const booking = await prisma.booking.create({
        data: {
            userId,
            flightId,
            passengerName,
            status: "Booked"
        }
    });
    return booking;
}

export async function getUserBookings(userId: string) {
    return await prisma.booking.findMany({
        where: { userId },
        include: { flight: true }
    });
}

export async function cancelBooking(userId: string, bookingId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("BOOKING_NOT_FOUND");
    if (booking.userId !== userId) throw new Error("FORBIDDEN");

    return await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "Cancelled" }
    });
}
