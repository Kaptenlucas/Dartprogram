import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameState, PlayerState } from "../types";
import { getGameState, submitTurn, undoTurn } from "../services/gameService";

const VALID_DARTS = [
  "MISS",
  "SBULL",
  "DBULL",
  ...Array.from({ length: 20 }, (_, index) => `S${index + 1}`),
  ...Array.from({ length: 20 }, (_, index) => `D${index + 1}`),
  ...Array.from({ length: 20 }, (_, index) => `T${index + 1}`),
];

const MatchPage = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [darts, setDarts] = useState(["S20", "S20", "S20"]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadState = async () => {
    try {
      const state = await getGameState();
      setGameState(state);
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Unable to load game state.");
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  const updateDart = (index: number, value: string) => {
    setDarts((current) => current.map((dart, idx) => (idx === index ? value : dart)));
  };

  const submit = async () => {
    if (!gameState || gameState.winner) return;

    setLoading(true);
    setError(null);

    try {
      const state = await submitTurn({ darts });
      setGameState(state);
    } catch (err) {
      setError((err as Error).message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const undo = async () => {
    if (!gameState) return;
    setLoading(true);
    setError(null);

    try {
      const state = await undoTurn();
      setGameState(state);
    } catch (err) {
      setError((err as Error).message || "Undo failed.");
    } finally {
      setLoading(false);
    }
  };

  const playerRow = (player: PlayerState, index: number) => (
    <div
      key={player.name}
      className={`player-row ${player.is_current ? "current-player" : ""}`}
    >
      <span>{player.name}</span>
      <strong>{player.score}</strong>
    </div>
  );

  if (error && !gameState) {
    return (
      <div className="page-container">
        <h1>Match</h1>
        <div className="error-box">{error}</div>
        <button className="button secondary" onClick={() => navigate("/new")}>
          Start New Game
        </button>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="page-container">
        <h1>Match</h1>
        <div>Loading game state…</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Match</h1>
      {gameState.winner ? (
        <div className="winner-box">
          <h2>Winner</h2>
          <p>{gameState.winner} has finished the game!</p>
          <button className="button primary" onClick={() => navigate("/new")}>Start Another Game</button>
        </div>
      ) : (
        <div className="status-box">
          <p>Current player: <strong>{gameState.current_player}</strong></p>
        </div>
      )}

      <div className="scoreboard">
        {gameState.players.map(playerRow)}
      </div>

      {!gameState.winner && (
        <div className="turn-form">
          <h2>Submit Turn</h2>
          <div className="select-grid">
            {darts.map((dart, index) => (
              <label key={index} className="select-field">
                Dart {index + 1}
                <select value={dart} onChange={(event) => updateDart(index, event.target.value)}>
                  {VALID_DARTS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          {error && <div className="error-box">{error}</div>}
          <div className="button-row">
            <button className="button primary" onClick={submit} disabled={loading}>
              {loading ? "Submitting…" : "Submit Turn"}
            </button>
            <button className="button secondary" onClick={undo} disabled={loading}>
              Undo Last Turn
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchPage;
