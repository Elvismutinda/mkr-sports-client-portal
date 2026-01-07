import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: "admin" | "user";
  phone: string;
//   paystackSubscriptionStart: Date;
//   paystackSubscriptionEnd: Date;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}