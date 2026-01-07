"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db/db";
import { user, verificationToken } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const verifyEmail = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken || existingToken.length === 0) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken[0].expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken[0].email);

  if (!existingUser || existingUser.length === 0) {
    return { error: "User not found" };
  }

  await db
    .update(user)
    .set({
      emailVerified: new Date(),
      email: existingToken[0].email,
    })
    .where(eq(user.id, existingUser[0].id));

  await db
    .delete(verificationToken)
    .where(eq(verificationToken.id, existingToken[0].id));

  return { success: "Email Verified" };
};