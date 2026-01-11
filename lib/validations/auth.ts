import { Position } from "@/types/types";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phone: z
      .string()
      .regex(/^\d{9}$/, "Phone number must be 9 digits (e.g. 712345678)"),
    position: z.enum(
      Object.values(Position) as [Position, ...Position[]],
      {
        message: "Position is required",
      }
    ),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
