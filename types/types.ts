export const POSITIONS = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
] as const;
export type Position = (typeof POSITIONS)[number];

export type UserRole = "player" | "agent";

export type TournamentStatus = "UPCOMING" | "ONGOING" | "COMPLETED";
export type TournamentFormat =
  | "LEAGUE"
  | "KNOCKOUT"
  | "GROUP_STAGE_KNOCKOUT"
  | "ROUND_ROBIN";

// Schema uses uppercase; legacy client code used lowercase — export both
export type FixtureStatus =
  | "UPCOMING"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "POSTPONED";

export type PaymentStatus = "pending" | "success" | "failed";

export type MediaType = "image" | "video";

export type TurfSurface =
  | "natural_grass"
  | "artificial_turf"
  | "futsal_floor"
  | "indoor";

export type SystemUserStatus = "active" | "inactive" | "suspended";

export type NotificationType =
  | "MATCH_REMINDER"
  | "PAYMENT_CONFIRMED"
  | "TOURNAMENT_UPDATE"
  | "TEAM_INVITE"
  | "GENERAL";


export interface Player {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: Position | null; // nullable in schema
  avatarUrl: string | null;
  role: UserRole;
  bio: string | null;
  isActive: boolean;
  stats: {
    matchesPlayed: number;
    goals: number;
    assists: number;
    motm: number;
    rating: number;
    wins: number;
    losses: number;
    draws: number;
  } | null;
  attributes: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defense: number;
    physical: number;
    stamina: number;
    workRate: number;
  } | null;
  aiAnalysis: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  position: Position | null;
  avatarUrl: string | null;
}

export interface Match {
  id: string;
  date: string; // ISO string from JSON; use `new Date(match.date)` when needed
  location: string;
  turfId: string | null;
  tournamentId: string | null;
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeTeam: string[];
  awayTeam: string[];
  mode: string;
  price: number; // cast from numeric in API
  maxPlayers: number;
  registeredPlayerIds: string[];
  status: FixtureStatus;
  completed: boolean;
  score: { home: number; away: number } | null;
  matchReport: string | null;
  isPublic: boolean;
  roundName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MatchPlayer {
  id: string;
  matchId: string;
  playerId: string;
  position: Position;
  team: "home" | "away";
  goals: number;
  assists: number;
  yellowCards: number;
  redCard: boolean;
  rating: number | null;
  motm: boolean;
}

export interface MatchPlayerWithUser {
  id: string;         // user id
  name: string;
  avatarUrl: string | null;
  position: Position;
  team: "home" | "away" | "unassigned";
}

export interface FixturePlayer {
  id: string;
  name: string;
  avatarUrl: string | null;
  position: Position;
  team: "home" | "away";
  goals: number;
  assists: number;
  rating: number | null;
  motm: boolean;
}

export interface FixtureDetail {
  fixture: Match;
  players: FixturePlayer[];
}

export interface Team {
  id: string;
  name: string;
  badgeUrl: string | null;
  badgeFallback: string | null; // initials, e.g. "NN"
  type: string | null;
  bio: string | null;
  captainId: string | null;
  stats: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    rating: number;
  } | null;
  memberCount?: number; // joined aggregate from API
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  playerId: string;
  position: Position | null;
  jerseyNumber: number | null;
  joinedAt: string;
  isActive: boolean;
  // Hydrated fields from JOIN
  player?: Participant;
}

export interface Standing {
  rank: number;
  name: string; // team or player name, resolved in API
  points: number;
  matchesPlayed?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  groupName?: string | null;
}

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  turfId: string | null;
  prizePool: number; // cast from numeric in API
  entryFee: number; // cast from numeric in API
  format: TournamentFormat;
  status: TournamentStatus;
  startsAt: string | null;
  endsAt: string | null;
  registrationDeadline: string | null;
  maxTeams: number | null;
  maxPlayersPerTeam: number | null;
  rules: string | null;
  isPublic: boolean;
  createdAt: string;
  // Alias forwarded by the API layer for backwards compat with existing components
  commencement: string | null;
  // Resolved in API responses
  participants?: Participant[];
  standings?: Standing[];
  standingsByGroup?: Record<string, Standing[]>;
  teams?: TournamentTeamEntry[];
  fixtures?: Match[];
}

// A team entry inside a tournament response
export interface TournamentTeamEntry {
  id: string;
  name: string;
  badgeFallback: string | null;
  badgeUrl: string | null;
  type: string | null;
  stats: Team["stats"];
  groupName: string | null;
  isEliminated: boolean;
  paymentStatus: PaymentStatus;
  registeredAt: string;
}

export interface Turf {
  id: string;
  name: string;
  area: string | null;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  surface: TurfSurface | null;
  amenities: string[];
  pricePerHour: number | null;
  rating: number;
  totalReviews: number;
  capacity: number | null;
  agentId: string | null;
  isActive: boolean;
  images: string[];
  // Computed in API — not stored in DB
  mapsQuery: string;
}

export interface MediaItem {
  id: string;
  uploaderId: string | null;
  type: MediaType;
  url: string;
  caption: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  matchId: string | null;
  tournamentId: string | null;
  amount: number;
  currency: string;
  phone: string;
  checkoutRequestId: string | null;
  merchantRequestId: string | null;
  mpesaReceiptNumber: string | null;
  status: PaymentStatus;
  failureReason: string | null;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string | null;
  isRead: boolean;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
}

export interface SystemRole {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  status: SystemUserStatus;
  roleId: string | null;
  role?: SystemRole;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  key: string;
  group: string | null;
  description: string | null;
  createdAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export const DEFAULT_PAGE_SIZE = 10;