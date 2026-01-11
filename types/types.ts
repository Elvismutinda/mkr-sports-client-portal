export enum Position {
  GK = 'Goalkeeper',
  DEF = 'Defender',
  MID = 'Midfielder',
  FWD = 'Forward'
}

export interface Player {
  id: string;
  name: string;
  email: string;
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
  type: 'image' | 'video';
  url: string; // Base64 or Blob URL
  caption: string;
  timestamp: string;
}

export type ViewState = 'landing' | 'dashboard' | 'schedule' | 'stats' | 'media' | 'profile';
