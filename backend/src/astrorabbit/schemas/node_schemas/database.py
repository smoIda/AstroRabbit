from typing import Any, Literal

from pydantic import BaseModel


class DatabaseConfig(BaseModel):
    database: Literal["MongoDB", "PostgreSQL", "MySQL"]


class DatabaseData(BaseModel):
    config: DatabaseConfig


class DatabaseNode(BaseModel):
    id: str
    type: Literal["DATABASE"] = "DATABASE"
    data: DatabaseData


class DatabaseOutput(BaseModel):
    body: Any = None
