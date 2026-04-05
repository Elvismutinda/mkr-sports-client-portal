export const POSITIONS = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
] as const;
export type Position = (typeof POSITIONS)[number];

export interface Player {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: Position;
  avatarUrl: string;
  stats: {
    matchesPlayed: number;
    goals: number;
    assists: number;
    motm: number; // Man of the match
    rating: number; // Average rating 0-10
  };
  attributes: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defense: number;
    physical: number;
    stamina: number;
    workRate: number;
  };
  aiAnalysis?: string;
}

export interface Match {
  id: string;
  date: Date;
  location: string;
  mode: string;
  price: number;
  homeTeam: string[];
  awayTeam: string[];
  maxPlayers: number;
  registeredPlayerIds: string[];
  score?: { home: number; away: number } | null;
  completed: boolean;
  matchReport?: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaItem {
  id: string;
  uploaderId: string;
  type: "image" | "video";
  url: string; // Base64 or Blob URL
  caption: string;
  timestamp: string;
}

export interface Tournament {
  id: number;
  name: string;
  location: string;
  description: string;
  prizePool: string;
  commencement: string;
  status: TournamentStatus;
  media?: MediaItem[];
  participants?: {
    id: string;
    name: string;
    email: string;
    position: Position;
    avatarUrl?: string;
  }[]; // Array of player/agent participants
}

export type TournamentStatus =
  | "UPCOMING OPERATION"
  | "ONGOING OPERATION"
  | "COMPLETED";

export type FixtureStatus = "upcoming" | "completed" | "live";

export interface Fixture {
  id: string;
  date: string;
  location: string;
  mode: string;
  price: string;
  homeTeam: string[];
  awayTeam: string[];
  maxPlayers: number;
  completed: boolean;
  score: { home: number; away: number } | null;
  matchReport: string | null;
  isPublic: boolean;
  playerPosition: Position;
}

export interface FixturePlayer {
  id: string;
  name: string;
  avatarUrl: string | null;
  position: string;
}

export interface FixtureDetail {
  fixture: Fixture;
  players: FixturePlayer[];
}
