from fastapi import APIRouter
from astrorabbit.services import github

router = APIRouter()

@router.get("/github")
async def get_star() -> int:
    return await github.GithubService().get_star()