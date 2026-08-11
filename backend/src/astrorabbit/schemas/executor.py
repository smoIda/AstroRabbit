from typing import Annotated, Any, Literal

from pydantic import BaseModel, Field

from astrorabbit.schemas.node_schemas.database import DatabaseNode
from astrorabbit.schemas.node_schemas.http_request import HttpRequestNode



Node = Annotated[HttpRequestNode | DatabaseNode, Field(discriminator="type")]


class Edge(BaseModel):
    id: str
    source: str
    target: str


class NodeOutput(BaseModel):
    node_id: str
    data: dict[str, Any]
    success: bool
    error: str | None = None


class ExecutionRequest(BaseModel):
    nodes: list[Node]
    edges: list[Edge]
    start_at: str = Field(validation_alias="startAt")


class ExecutionEvent(BaseModel):
    type: Literal[
        "EXECUTION_STARTED",
        "EXECUTION_FINISHED",
        "EXECUTION_CANCELLED",
        "EXECUTION_ERROR",
        "NODE_STARTED",
        "NODE_CANCELLED",
        "NODE_FINISHED",
        "NODE_ERROR",
        "EDGE_STARTED",
        "EDGE_FINISHED",
    ]
    node_id: str | None = Field(default=None, serialization_alias="nodeId")
    edge_id: str | None = Field(default=None, serialization_alias="edgeId")
    duration: float = 0
    data: dict[str, Any] | None = None


class ExecutionResponse(BaseModel):
    execution_id: str = Field(serialization_alias="executionId")
