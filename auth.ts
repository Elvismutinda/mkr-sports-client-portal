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
        session.user.role = token.role as "admin" | "user";
        session.user.phone = token.phone as string;
        // session.user.paystackSubscriptionStart =
        //   token.paystackSubscriptionStart as Date;
        // session.user.paystackSubscriptionEnd =
        //   token.paystackSubscriptionEnd as Date;
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
    //   token.paystackSubscriptionStart = user.paystackSubscriptionStart;
    //   token.paystackSubscriptionEnd = user.paystackSubscriptionEnd;

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