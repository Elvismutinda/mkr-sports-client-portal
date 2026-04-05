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

interface Standing {
  rank: number;
  name: string;
  points: number;
}

export interface Tournament {
  id: string;
  name: string;
  location?: string;
  description?: string;
  prizePool: number;
  commencement?: string;
  status: TournamentStatus;
  media?: MediaItem[];
  participants?: {
    id: string;
    name: string;
    email: string;
    position: Position;
    avatarUrl?: string;
  }[];
  standings?: Standing[];
}

export type TournamentStatus =
  | "UPCOMING"
  | "ONGOING"
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

export interface Team {
  id: string;
  name: string;
  badge: string; // initials fallback
  type: string;
  bio: string;
  stats: { ops: number; won: number; rtg: number };
  members: string[]; // avatar URLs or initials
}

export interface Turf {
  id: string;
  name: string;
  area: string;
  city: string;
  rating: number;
  amenities: string[];
  mapsQuery: string;
}