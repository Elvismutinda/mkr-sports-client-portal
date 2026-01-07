"use server";

import bcrypt from "bcryptjs";
import { RegisterRequest, RegisterSchema } from "@/lib/validations/auth";
import { db } from "@/lib/db/db";
import { user } from "@/lib/db/schema";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/data/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: RegisterRequest) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user already exists
  const existingUser = await getUserByEmail(email);

  if (existingUser && existingUser.length > 0) {
    return { error: "User already exists!" };
  }

  await db.insert(user).values({
    name,
    email,
    password: hashedPassword,
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Verification email sent! (Check inbox or spam)" };
};