import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["player"] & {
  role: "player" | "agent";
  phone: string;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
  // stats?: {
  //   matchesPlayed: number;
  //   goals: number;
  //   assists: number;
  //   motm: number;
  //   rating: number;
  // };
  // attributes?: {
  //   pace: number;
  //   shooting: number;
  //   passing: number;
  //   dribbling: number;
  //   defense: number;
  //   physical: number;
  //   stamina: number;
  //   workRate: number;
  // };
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}