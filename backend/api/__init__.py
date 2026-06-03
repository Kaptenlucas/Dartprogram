from fastapi import APIRouter
from .players import router as players_router

router = APIRouter()
router.include_router(players_router)