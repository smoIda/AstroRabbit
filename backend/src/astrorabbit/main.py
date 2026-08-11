from fastapi import FastAPI

from astrorabbit.config.cors import configure_cors

from .routers.github import router as github_router
from .routers.executor import router as executor_router

app = FastAPI()


prefix = "/api"

configure_cors(app)

app.include_router(github_router, prefix=prefix)
app.include_router(executor_router, prefix=prefix)
