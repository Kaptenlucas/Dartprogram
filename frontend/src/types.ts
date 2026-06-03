export interface PlayerState {
  name: string;
  score: number;
  finished: boolean;
  is_current: boolean;
}

export interface GameState {
  players: PlayerState[];
  current_player?: string | null;
  winner?: string | null;
  started: boolean;
}

export interface GameCreatePayload {
  player_names: string[];
}

export interface TurnPayload {
  darts: string[];
}
