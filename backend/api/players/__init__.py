from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.models import Player
from backend.database.database import get_db
from backend.schemas import PlayerCreate
router = APIRouter()

@router.get("/players/", tags=["players"])
def read_players(db: Session = Depends(get_db)):
    return db.query(Player).all()

@router.post("/players/", tags=["players"])
def create_player(player: PlayerCreate, db: Session = Depends(get_db)):
    new_player = Player(name=player.name)
    db.add(new_player)
    db.commit()
    db.refresh(new_player)
    return new_player