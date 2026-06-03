from __future__ import annotations

from dataclasses import dataclass, field
from typing import List


@dataclass
class Player:
    """Represents a single player in a 501 dart game."""

    name: str
    score: int = 501
    turn_history: List["Turn"] = field(default_factory=list)
    finished: bool = False

    def record_turn(self, turn: "Turn") -> None:
        """Record a completed turn for this player.

        Args:
            turn: The completed Turn object for this player.
        """
        self.turn_history.append(turn)
        self.score = turn.ending_score
        self.finished = turn.checkout

    def undo_last_turn(self) -> None:
        """Undo the most recently recorded turn for this player.

        Raises:
            ValueError: If there is no turn to undo.
        """
        if not self.turn_history:
            raise ValueError("No turns to undo for this player")

        last_turn = self.turn_history.pop()
        self.score = last_turn.starting_score
        self.finished = False
