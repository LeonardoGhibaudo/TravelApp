import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createNotification(userId: string, type: string, message: string) {
    return await prisma.notification.create({
        data: {
            userId,
            type,
            message
        }
    });
}

export async function getUserNotifications(userId: string) {
    return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
}

export async function markNotificationAsRead(userId: string, notificationId: string) {
    const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification) throw new Error("NOTIFICATION_NOT_FOUND");
    if (notification.userId !== userId) throw new Error("FORBIDDEN");

    return await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
    });
}
