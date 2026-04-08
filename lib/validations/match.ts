import * as z from "zod";

export const MatchRegisterSchema = z.object({
  teamId: z.string().min(1, "Please select a team"),
  selectedPlayerIds: z
    .array(z.string())
    .min(1, "Select at least one player to participate"),
  phone: z
    .string()
    .regex(/^\d{9}$/, "Phone number must be 9 digits (e.g. 712345678)"),
  termsAccepted: z.literal(true, {
    message: "You must accept the terms to continue",
  }),
});

export type MatchRegisterRequest = z.infer<typeof MatchRegisterSchema>;