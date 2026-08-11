from typing import Literal

from pydantic import BaseModel, ConfigDict


class _DatabaseData(BaseModel):
    model_config = ConfigDict(extra="ignore")

    database: Literal["MongoDB", "PostgreSQL", "MySQL"]


class DatabaseNode(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    type: Literal["DATABASE"]
    data: _DatabaseData
