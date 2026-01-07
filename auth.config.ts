import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { LoginSchema } from "@/lib/validations/auth";
import { getUserByEmail } from "@/data/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          // Check if user exists
          const user = await getUserByEmail(email);
          if (!user || user.length === 0) return null;

          // Check if password is correct
          const passwordsMatch = await bcrypt.compare(
            password,
            user[0].password!
          );

          if (passwordsMatch) return user[0];
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;