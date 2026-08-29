import asyncio
from dataclasses import dataclass, field
from typing import Annotated, Any, Literal

from pydantic import BaseModel, Field

from astrorabbit.schemas.node_schemas.database import DatabaseNode, DatabaseOutput
from astrorabbit.schemas.node_schemas.http_request import (
    HttpRequestNode,
    HttpRequestOutput,
)

Node = Annotated[HttpRequestNode | DatabaseNode, Field(discriminator="type")]


class Edge(BaseModel):
    id: str
    source: str
    target: str


class NodeResult[T](BaseModel):
    success: bool
    output: T


class ExecutionRequest(BaseModel):
    nodes: list[Node]
    edges: list[Edge]
    start_at: str = Field(validation_alias="startAt")


class ExecutionStartedEvent(BaseModel):
    type: Literal["EXECUTION_STARTED"] = "EXECUTION_STARTED"


class ExecutionSuccessEvent(BaseModel):
    type: Literal["EXECUTION_SUCCESS"] = "EXECUTION_SUCCESS"


class ExecutionErrorEvent(BaseModel):
    type: Literal["EXECUTION_ERROR"] = "EXECUTION_ERROR"
    output: str | None = None


class ExecutionAbortedEvent(BaseModel):
    type: Literal["EXECUTION_ABORTED"] = "EXECUTION_ABORTED"


class NodeStartedEvent(BaseModel):
    type: Literal["NODE_STARTED"] = "NODE_STARTED"
    node_id: str = Field(serialization_alias="nodeId")


class NodeSuccessEvent(BaseModel):
    type: Literal["NODE_SUCCESS"] = "NODE_SUCCESS"
    node_id: str = Field(serialization_alias="nodeId")
    duration: float | None = None
    output: HttpRequestOutput | DatabaseOutput


class NodeSkippedEvent(BaseModel):
    type: Literal["NODE_SKIPPED"] = "NODE_SKIPPED"
    node_id: str = Field(serialization_alias="nodeId")
    duration: float | None = None


class NodeErrorEvent(BaseModel):
    type: Literal["NODE_ERROR"] = "NODE_ERROR"
    node_id: str = Field(serialization_alias="nodeId")
    duration: float | None = None
    output: dict[str, Any] | str | None = None


class EdgeStartedEvent(BaseModel):
    type: Literal["EDGE_STARTED"] = "EDGE_STARTED"
    edge_id: str = Field(serialization_alias="edgeId")


class EdgeFinishedEvent(BaseModel):
    type: Literal["EDGE_FINISHED"] = "EDGE_FINISHED"
    edge_id: str = Field(serialization_alias="edgeId")


class EdgeSkippedEvent(BaseModel):
    type: Literal["EDGE_SKIPPED"] = "EDGE_SKIPPED"
    edge_id: str = Field(serialization_alias="edgeId")


ExecutionEvent = Annotated[
    ExecutionStartedEvent
    | ExecutionSuccessEvent
    | ExecutionErrorEvent
    | ExecutionAbortedEvent
    | NodeStartedEvent
    | NodeSuccessEvent
    | NodeErrorEvent
    | NodeSkippedEvent
    | EdgeStartedEvent
    | EdgeFinishedEvent
    | EdgeSkippedEvent,
    Field(discriminator="type"),
]


@dataclass
class ExecutionState:
    executed: set[str] = field(default_factory=set[str])
    output: dict[str, Any] = field(default_factory=dict[str, Any])
    skip_events: dict[str, asyncio.Event] = field(
        default_factory=dict[str, asyncio.Event]
    )


class ExecutionResponse(BaseModel):
    execution_id: str = Field(serialization_alias="executionId")
