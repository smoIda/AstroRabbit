from typing import Annotated, Any, Literal

from pydantic import BaseModel, Field, JsonValue


class HttpMockConfig(BaseModel):
    provider: Literal["MOCK_API"] = "MOCK_API"

    headers: dict[str, str] = Field(default_factory=dict)
    method: Literal["GET", "POST", "PUT", "PATCH", "DELETE"] = "GET"
    body: JsonValue | None = None
    latency: float = Field(default=0, ge=0, le=10)
    status_code: int = Field(default=200, ge=100, le=599, validation_alias="statusCode")
    failure_rate: float = Field(default=0, ge=0, le=100, validation_alias="failureRate")


class HttpCustomConfig(BaseModel):
    provider: Literal["CUSTOM_API"] = "CUSTOM_API"

    headers: dict[str, str] = Field(default_factory=dict)
    method: Literal["GET", "POST", "PUT", "PATCH", "DELETE"] = "GET"
    body: JsonValue | None = None
    url: str


class HttpRequestData(BaseModel):
    config: Annotated[
        HttpMockConfig | HttpCustomConfig, Field(discriminator="provider")
    ]


class HttpRequestNode(BaseModel):
    id: str
    type: Literal["HTTP_REQUEST"] = "HTTP_REQUEST"
    data: HttpRequestData


class HttpRequestOutput(BaseModel):
    status_code: int = Field(
        default=200, ge=100, le=599, serialization_alias="statusCode"
    )
    headers: dict[str, str] = Field(default_factory=dict)
    body: Any = None
