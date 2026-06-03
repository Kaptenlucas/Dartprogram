from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.game_engine import create_game, Game

router = APIRouter(prefix="/game", tags=["game"])
current_game: Optional[Game] = None


class GameCreateRequest(BaseModel):
    player_names: List[str] = Field(..., min_items=2, max_items=8)


class TurnRequest(BaseModel):
    darts: List[str] = Field(..., min_items=1, max_items=3)


class PlayerState(BaseModel):
    name: str
    score: int
    finished: bool
    is_current: bool


class GameStateResponse(BaseModel):
    players: List[PlayerState]
    current_player: Optional[str]
    winner: Optional[str]
    started: bool


def _serialize_state(game: Game) -> GameStateResponse:
    current_player = None
    if game.started and game.winner is None:
        current_player = game.get_current_player().name

    return GameStateResponse(
        players=[
            PlayerState(
                name=player.name,
                score=player.score,
                finished=player.finished,
                is_current=(index == game.current_index),
            )
            for index, player in enumerate(game.players)
        ],
        current_player=current_player,
        winner=game.winner.name if game.winner else None,
        started=game.started,
    )


@router.post("/new", response_model=GameStateResponse)
def new_game(payload: GameCreateRequest) -> GameStateResponse:
    global current_game
    current_game = create_game(payload.player_names)
    current_game.start_game()
    return _serialize_state(current_game)


@router.get("/state", response_model=GameStateResponse)
def get_state() -> GameStateResponse:
    if current_game is None:
        raise HTTPException(status_code=404, detail="No active game")
    return _serialize_state(current_game)


@router.post("/submit", response_model=GameStateResponse)
def submit_turn(payload: TurnRequest) -> GameStateResponse:
    if current_game is None:
        raise HTTPException(status_code=404, detail="No active game")

    try:
        current_game.submit_turn(payload.darts)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return _serialize_state(current_game)


@router.post("/undo", response_model=GameStateResponse)
def undo_turn() -> GameStateResponse:
    if current_game is None:
        raise HTTPException(status_code=404, detail="No active game")

    try:
        current_game.undo_last_turn()
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return _serialize_state(current_game)
