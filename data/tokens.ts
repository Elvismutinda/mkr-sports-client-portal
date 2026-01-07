import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "./verification-token";
import { db } from "@/lib/db/db";
import { verificationToken } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1hr

  // check if token already exists
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken && existingToken.length > 0) {
    await db
      .delete(verificationToken)
      .where(eq(verificationToken.id, existingToken[0].id));
  }

  const [newToken] = await db.insert(verificationToken).values({
    email,
    token,
    expires,
  })
  .returning();

  return newToken;
};