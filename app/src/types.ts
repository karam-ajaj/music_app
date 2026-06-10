export interface Track {
  id: string;
  name: string;
  nameAr: string;
  artists: string[];
  artistsAr: string[];
  album: string;
  albumArt: string;
  year: string;
  durationMs: number;
  previewUrl: string;
}

export type GamePhase = 'playing' | 'revealed';

export interface GameState {
  phase: GamePhase;
  currentTrack: Track | null;
  playedIds: string[];
  queue: Track[];
}
