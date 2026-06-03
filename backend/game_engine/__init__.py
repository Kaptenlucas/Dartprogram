"""Simple dart game engine package exports."""

from .game import Game
from .player import Player
from .turn import Turn
from .rules import (
    calculate_turn_result,
    is_double_out,
    is_valid_dart_notation,
    score_dart,
    score_turn,
    validate_turn_darts,
)


def create_game(player_names: list[str]) -> Game:
    """Create a new Game instance with the provided player names.

    Args:
        player_names: The ordered list of player names for the game.

    Returns:
        A new Game instance configured with the given players.
    """
    return Game(player_names)


__all__ = [
    "Game",
    "Player",
    "Turn",
    "create_game",
    "calculate_turn_result",
    "is_double_out",
    "is_valid_dart_notation",
    "score_dart",
    "score_turn",
    "validate_turn_darts",
]
