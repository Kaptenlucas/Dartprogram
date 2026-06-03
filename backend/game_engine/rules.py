"""Dart scoring and validation utilities for a 501 game."""

from __future__ import annotations

from typing import List, Tuple

VALID_SINGLE_NUMBERS = set(str(value) for value in range(1, 21))
VALID_NOTATIONS = {
    "MISS": 0,
    "SBULL": 25,
    "DBULL": 50,
}
VALID_PREFIXES = {"S": 1, "D": 2, "T": 3}


def is_valid_dart_notation(dart: str) -> bool:
    """Return True if the dart string is valid notation."""
    if dart in VALID_NOTATIONS:
        return True

    prefix = dart[:1]
    number = dart[1:]

    if prefix not in VALID_PREFIXES:
        return False

    return number in VALID_SINGLE_NUMBERS


def score_dart(dart: str) -> int:
    """Convert a dart notation string into its integer score."""
    dart = dart.strip().upper()
    if dart in VALID_NOTATIONS:
        return VALID_NOTATIONS[dart]

    if len(dart) < 2:
        raise ValueError(f"Invalid dart notation: {dart}")

    prefix = dart[0]
    number_text = dart[1:]

    if prefix not in VALID_PREFIXES:
        raise ValueError(f"Invalid dart notation: {dart}")

    if number_text not in VALID_SINGLE_NUMBERS:
        raise ValueError(f"Invalid dart notation: {dart}")

    multiplier = VALID_PREFIXES[prefix]
    return multiplier * int(number_text)


def is_double_out(dart: str) -> bool:
    """Return True when the dart notation qualifies as a double-out."""
    dart = dart.strip().upper()
    return dart == "DBULL" or dart.startswith("D")


def validate_turn_darts(darts: List[str]) -> bool:
    """Validate a turn's dart notations and dart count."""
    if not darts or len(darts) > 3:
        return False

    return all(is_valid_dart_notation(dart) for dart in darts)


def score_turn(darts: List[str]) -> int:
    """Calculate the total score for a list of dart throws."""
    if not validate_turn_darts(darts):
        raise ValueError("Invalid dart list for a turn")

    return sum(score_dart(dart) for dart in darts)


def calculate_turn_result(current_score: int, darts: List[str]) -> Tuple[int, bool, bool]:
    """Calculate the turn result for a 501 game.

    Args:
        current_score: The player's score at the start of the turn.
        darts: The list of dart notations thrown this turn.

    Returns:
        A tuple of (ending_score, bust, checkout).
    """
    if not validate_turn_darts(darts):
        raise ValueError("Invalid dart list for a turn")

    remaining = current_score

    for dart in darts:
        hit_score = score_dart(dart)
        remaining -= hit_score

        if remaining < 0 or remaining == 1:
            return current_score, True, False

        if remaining == 0:
            if is_double_out(dart):
                return 0, False, True
            return current_score, True, False

    return remaining, False, False
