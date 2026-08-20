from pydantic import BaseModel, Field


class Github(BaseModel):
    star: int = Field(alias="stargazers_count", default=0)
