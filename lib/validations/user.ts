import { POSITIONS } from "@/types/types";
import * as z from "zod";

export const updatePasswordSchema = z
  .object({
    password: z.string().min(1, "Password is required"),
    newPassword: z.string().min(1, "New password is required"),
    confirmNewPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

export const updateAccountSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .regex(/^\d{9}$/, "Phone number must be 9 digits (e.g. 712345678)"),
  position: z.enum(POSITIONS, {
    message: "Position is required",
  }),
});

export type UpdatePasswordRequest = z.infer<typeof updatePasswordSchema>;
export type UpdateAccountRequest = z.infer<typeof updateAccountSchema>;
