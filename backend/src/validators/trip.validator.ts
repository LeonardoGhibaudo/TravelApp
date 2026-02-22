import { z } from "zod";

const baseTripSchema = z.object({
    name: z.string().min(1, "Il nome non puó essere vuoto"),
    destination: z.string().min(1, "La destinazione non puó essere vuota"),
    startDate: z.string().date("Data di inizio non valida"),
    endDate: z.string().date("Data di fine non valida")
})

export const createTripSchema = baseTripSchema.refine(
    data => new Date(data.startDate) < new Date(data.endDate),
    {"message": "la data di fine non puó essere precedente alla data di inizio "}
)

export const updateTripSchema = baseTripSchema.partial().refine(
    data => !data.startDate || ! data.endDate || new Date(data.startDate) < new Date(data.endDate),
    {"message": "la data di fine non puó essere precedente alla data di inizio "}
)
