import * as z from "zod";

export const MatchRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^\d{9}$/, "Phone number must be 9 digits (e.g. 712345678)"),
});

export type MatchRegisterRequest = z.infer<typeof MatchRegisterSchema>;
