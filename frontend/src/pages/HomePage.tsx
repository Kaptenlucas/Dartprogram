import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1>Welcome to Dart Score MVP</h1>
      <p>Track a manual 501 game with player turns, checkout, and undo support.</p>
      <button className="button primary" onClick={() => navigate("/new")}>Start New Game</button>
    </div>
  );
};

export default HomePage;
