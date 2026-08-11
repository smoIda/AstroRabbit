import httpx

from astrorabbit.schemas.github import Github


class GithubService:
    async def get_star(self) -> int:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.github.com/repos/smoIda/Bunvia", timeout=10
            )  # in seconds

        response.raise_for_status()  # Checks if the request is successful

        return Github.model_validate(response.json()).star
