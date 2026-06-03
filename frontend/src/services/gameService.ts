import { GameCreatePayload, GameState, TurnPayload } from "../types";

const apiPost = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }

  return response.json();
};

const apiGet = async <T>(path: string): Promise<T> => {
  const response = await fetch(path);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }
  return response.json();
};

export const createGame = (payload: GameCreatePayload): Promise<GameState> =>
  apiPost<GameState>("/api/game/new", payload);

export const getGameState = (): Promise<GameState> => apiGet<GameState>("/api/game/state");

export const submitTurn = (payload: TurnPayload): Promise<GameState> =>
  apiPost<GameState>("/api/game/submit", payload);

export const undoTurn = (): Promise<GameState> => apiPost<GameState>("/api/game/undo", {});
