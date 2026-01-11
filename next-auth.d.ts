import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: "admin" | "user";
  phone: string;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
//   paystackSubscriptionStart: Date;
//   paystackSubscriptionEnd: Date;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}