"use server";

import { db } from "@/lib/db/db";
import { passwordResetToken } from "@/lib/db/schema";
import { getUserByEmail } from "@/data/user";
import { sendPlayerPasswordResetEmail } from "@/lib/mail";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function forgotPassword(email: string) {
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  const existingUser = await getUserByEmail(email);

  // Always return success to prevent email enumeration
  if (!existingUser || existingUser.length === 0) {
    return {
      success: "If that email is registered, a reset link has been sent.",
    };
  }

  const foundUser = existingUser[0];

  if (!foundUser.isActive) {
    return { error: "This account has been deactivated." };
  }

  // Invalidate any existing tokens for this email
  await db
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.email, email));

  // Generate a secure token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  await db.insert(passwordResetToken).values({
    email,
    token,
    expires,
  });

  await sendPlayerPasswordResetEmail(email, token);

  return {
    success: "If that email is registered, a reset link has been sent.",
  };
}
