import z from "zod";

export const changeParticipantRoleSchema = z.object({
    role: z.enum(["VIEWER", "EDITOR"])
})
