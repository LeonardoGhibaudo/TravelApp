import type { Request, Response } from "express";
import { getUserNotifications, markNotificationAsRead } from "../services/notification.service.js";

export async function getNotifications(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const notifications = await getUserNotifications(userId);
        return res.json(notifications);
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
}

export async function readNotification(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const { notificationId } = req.params;
        const notification = await markNotificationAsRead(userId, notificationId);
        return res.json(notification);
    } catch (err: any) {
        if (err.message === "NOTIFICATION_NOT_FOUND") return res.status(404).json({ error: "Notifica non trovata" });
        if (err.message === "FORBIDDEN") return res.status(403).json({ error: "Accesso negato" });
        return res.status(500).json({ error: err.message });
    }
}
