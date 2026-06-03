import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGame } from "../services/gameService";

const NewGamePage = () => {
  const [playerNames, setPlayerNames] = useState<string[]>(["", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateName = (index: number, value: string) => {
    setPlayerNames((current) => current.map((name, idx) => (idx === index ? value : name)));
  };

  const addPlayer = () => {
    if (playerNames.length >= 8) return;
    setPlayerNames((current) => [...current, ""]);
  };

  const removePlayer = (index: number) => {
    if (playerNames.length <= 2) return;
    setPlayerNames((current) => current.filter((_, idx) => idx !== index));
  };

  const validPlayerNames = playerNames
    .map((name) => name.trim())
    .filter(Boolean);

  const canStart = validPlayerNames.length >= 2 && validPlayerNames.length <= 8;

  const startGame = async () => {
    if (!canStart) {
      setError("Enter between 2 and 8 player names.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createGame({ player_names: validPlayerNames });
      navigate("/match");
    } catch (err) {
      setError((err as Error).message || "Failed to create game.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>New Game</h1>
      <p>Enter between 2 and 8 player names.</p>
      <div className="form-grid">
        {playerNames.map((name, index) => (
          <div key={index} className="player-input-row">
            <input
              value={name}
              onChange={(event) => updateName(index, event.target.value)}
              placeholder={`Player ${index + 1}`}
            />
            {playerNames.length > 2 && (
              <button type="button" className="button danger small" onClick={() => removePlayer(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="row-gap">
        <button type="button" className="button secondary" onClick={addPlayer} disabled={playerNames.length >= 8}>
          Add Player
        </button>
      </div>
      {error && <div className="error-box">{error}</div>}
      <button type="button" className="button primary" onClick={startGame} disabled={!canStart || loading}>
        {loading ? "Starting..." : "Start Game"}
      </button>
    </div>
  );
};

export default NewGamePage;
