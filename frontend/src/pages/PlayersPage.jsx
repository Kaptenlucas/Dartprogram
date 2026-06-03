import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get('/api/players/')
      .then(response => setPlayers(response.data))
      .catch(error => console.error('Error fetching players:', error));
  }, []);

  return (
    <div>
      <h1>Players</h1>
      <ul>
        {players.map(player => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlayersPage;