"use server";

import { db } from "@/lib/db/db";
import { passwordResetToken, user } from "@/lib/db/schema";
import { getUserByEmail } from "@/data/user";
import { eq } from "drizzle-orm";

export async function resetPassword(token: string, newPassword: string) {
  if (!token) return { error: "Invalid or missing token." };
  if (!newPassword || newPassword.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  // Find the token
  const [existingToken] = await db
    .select()
    .from(passwordResetToken)
    .where(eq(passwordResetToken.token, token));

  if (!existingToken) {
    return { error: "Invalid or expired reset link." };
  }

  if (existingToken.usedAt) {
    return { error: "This reset link has already been used." };
  }

  if (new Date(existingToken.expires) < new Date()) {
    return { error: "This reset link has expired. Please request a new one." };
  }

  // Find the user
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser || existingUser.length === 0) {
    return { error: "Account not found." };
  }

  // Hash the new password
  const bcrypt = await import("bcryptjs");
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password and mark token as used
  await db
    .update(user)
    .set({ password: hashedPassword, updatedAt: new Date() })
    .where(eq(user.id, existingUser[0].id));

  await db
    .update(passwordResetToken)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetToken.id, existingToken.id));

  return { success: "Password updated successfully. You can now sign in." };
}
