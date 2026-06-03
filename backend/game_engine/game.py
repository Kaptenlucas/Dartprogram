from __future__ import annotations

from typing import List, Optional, Tuple

from .player import Player
from .rules import calculate_turn_result, validate_turn_darts
from .turn import Turn


class Game:
    """A pure dart game engine for a standard 501 game."""

    def __init__(self, player_names: List[str]):
        """Initialize a new Game object.

        Args:
            player_names: Ordered list of player names for the game.

        Raises:
            ValueError: If the number of players is not between 2 and 8.
        """
        if len(player_names) < 2 or len(player_names) > 8:
            raise ValueError("Game must have between 2 and 8 players")

        self.players: List[Player] = [Player(name=name.strip()) for name in player_names]
        self.current_index: int = 0
        self.history: List[Tuple[int, Turn]] = []
        self.winner: Optional[Player] = None
        self.started: bool = False

    @classmethod
    def create_game(cls, player_names: List[str]) -> "Game":
        """Create a new Game instance with the provided player names."""
        return cls(player_names)

    def start_game(self) -> None:
        """Start or reset the game to the initial 501 state."""
        self.started = True
        self.current_index = 0
        self.history.clear()
        self.winner = None

        for player in self.players:
            player.score = 501
            player.turn_history.clear()
            player.finished = False

    def get_current_player(self) -> Player:
        """Return the player whose turn is current."""
        if not self.started:
            raise RuntimeError("Game has not started")
        return self.players[self.current_index]

    def submit_turn(self, darts: List[str]) -> Turn:
        """Submit a turn of darts for the current player.

        Args:
            darts: List of dart notation strings for the current turn.

        Returns:
            The Turn object representing the completed turn.

        Raises:
            RuntimeError: If the game is not started or already finished.
            ValueError: If the provided dart notations are invalid.
        """
        if not self.started:
            raise RuntimeError("Game has not started")

        if self.winner is not None:
            raise RuntimeError("Game is already finished")

        if not validate_turn_darts(darts):
            raise ValueError("Each turn must contain 1 to 3 valid dart notations")

        player = self.get_current_player()
        starting_score = player.score
        ending_score, bust, checkout = calculate_turn_result(starting_score, darts)

        turn = Turn(
            player_name=player.name,
            darts=list(darts),
            starting_score=starting_score,
            ending_score=ending_score,
            bust=bust,
            checkout=checkout,
        )

        player.record_turn(turn)
        self.history.append((self.current_index, turn))

        if checkout:
            self.winner = player
            return turn

        self._advance_player()
        return turn

    def undo_last_turn(self) -> Turn:
        """Undo the last submitted turn and restore game state."""
        if not self.history:
            raise RuntimeError("No turns to undo")

        player_index, turn = self.history.pop()
        player = self.players[player_index]
        player.undo_last_turn()

        if self.winner is player:
            self.winner = None

        self.current_index = player_index
        return turn

    def check_winner(self) -> Optional[Player]:
        """Return the current winner, or None if the game is still active."""
        return self.winner

    def _advance_player(self) -> None:
        """Advance the current player index to the next player."""
        self.current_index = (self.current_index + 1) % len(self.players)
