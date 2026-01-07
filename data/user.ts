import { db } from "@/lib/db/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    return await db.select().from(user).where(eq(user.id, id));
  } catch {
    return null;
  }
};