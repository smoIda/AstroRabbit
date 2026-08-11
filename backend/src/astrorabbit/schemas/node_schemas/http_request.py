from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class _HttpRequestData(BaseModel):
    model_config = ConfigDict(extra="ignore")

    method: Literal["GET", "POST", "PUT", "PATCH", "DELETE"]
    url: str
    headers: dict[str, str] = Field(default_factory=dict)
    body: str | None = None


class HttpRequestNode(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    type: Literal["HTTP_REQUEST"]
    data: _HttpRequestData
