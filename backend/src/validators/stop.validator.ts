import { z } from "zod";

const baseStopSchema = z.object({
    title: z.string().min(1, "Il titolo non puó essere vuoto"),
    location: z.string().min(1, "La location non puó essere vuota"),
    plannedTime: z.string().datetime("PlannedTime non valido"),
    orderIndex: z.number().int().nonnegative("Il numero non puó essere negativo").optional()
}
)

export const createStopSchema = baseStopSchema
export const updateStopSchema = baseStopSchema.partial()
