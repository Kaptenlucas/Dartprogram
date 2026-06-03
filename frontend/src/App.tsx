import { Route, Routes, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewGamePage from "./pages/NewGamePage";
import MatchPage from "./pages/MatchPage";

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          Dart Score MVP
        </Link>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<NewGamePage />} />
          <Route path="/match" element={<MatchPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
