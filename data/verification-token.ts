import { db } from "@/lib/db/db";
import { verificationToken } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.email, email))
      .limit(1);
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    return await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.token, token));
  } catch {
    return null;
  }
};