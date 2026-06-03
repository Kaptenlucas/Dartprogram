from __future__ import annotations

from dataclasses import dataclass
from typing import List


@dataclass
class Turn:
    """Represents a single turn in the dart game."""

    player_name: str
    darts: List[str]
    starting_score: int
    ending_score: int
    bust: bool = False
    checkout: bool = False

    @property
    def score(self) -> int:
        """Return the scored points for this turn.

        Returns:
            Points scored in the turn, or 0 if the turn was a bust.
        """
        if self.bust:
            return 0
        return self.starting_score - self.ending_score
