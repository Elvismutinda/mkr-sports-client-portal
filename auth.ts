import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/db/db";
import authConfig from "./auth.config";
import { getUserById } from "@/data/user";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      // console.log({ user, account });
      if (account?.provider === "credentials") {
        // check if email is verified
        if (!user.id) return false;

        const existingUser = await getUserById(user.id);

        if (!existingUser || !existingUser[0].emailVerified) return false;
      }

      return true;
    },
    async session({ token, session }) {
      // console.log({ sessionToken: token });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.role = token.role as "player" | "agent";
        session.user.phone = token.phone as string;
        session.user.avatarUrl = token.avatarUrl as string;
        session.user.position = token.position as "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
      }

      // console.log(session);

      return session;
    },
    async jwt({ token }) {
      //   console.log({ token });
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const user = existingUser[0];

      token.role = user.role;
      token.phone = user.phone;
      token.avatarUrl = user.avatarUrl; 
      token.position = user.position;

      return token;
    },
  },
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  ...authConfig,
});