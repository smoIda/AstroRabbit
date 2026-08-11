import asyncio

import time
from typing import Awaitable, Callable

from astrorabbit.engine.executor import execution_manager
from astrorabbit.schemas.executor import (
    Edge,
    ExecutionEvent,
    ExecutionRequest,
    Node,
    NodeOutput,
)
from astrorabbit.services.node_executors.database import execute_database
from astrorabbit.services.node_executors.http_request import execute_request


async def execute_node(
    node: Node,
    nodes: list[Node],
    edges: list[Edge],
    executed: set[str],
    emit: Callable[[ExecutionEvent], Awaitable[None]],
) -> NodeOutput | None:
    if node.id in executed:
        return

    executed.add(node.id)

    await emit(ExecutionEvent(type="NODE_STARTED", node_id=node.id))

    start_time = time.perf_counter()

    try:
        match node.type:
            case "HTTP_REQUEST":
                output = await execute_request(node)

            case "DATABASE":
                output = await execute_database(node)

            case _:
                raise ValueError(f"Unsupported node type: {node.type}")

    except asyncio.CancelledError:
        duration = time.perf_counter() - start_time

        await emit(
            ExecutionEvent(type="NODE_CANCELLED", node_id=node.id, duration=duration)
        )
        raise

    except Exception as error:
        duration = time.perf_counter() - start_time

        await emit(
            ExecutionEvent(
                type="NODE_ERROR",
                node_id=node.id,
                duration=duration,
                data={"message": str(error)},
            )
        )
        raise

    duration = time.perf_counter() - start_time

    await emit(
        ExecutionEvent(
            type="NODE_FINISHED",
            node_id=node.id,
            duration=duration,
            data={"output": output.data},
        )
    )

    outgoing_edges = [edge for edge in edges if edge.source == node.id]

    for edge in outgoing_edges:
        await emit(ExecutionEvent(type="EDGE_STARTED", edge_id=edge.id))

        next_node = next(
            (candidate for candidate in nodes if candidate.id == edge.target), None
        )  # next(iterator, default) retrieves the very first item from an iterator

        if next_node is None:
            raise ValueError(f"Target node '{edge.target}' not found")

        await execute_node(
            next_node,
            nodes,
            edges,
            executed,
            emit,
        )

        await emit(ExecutionEvent(type="EDGE_FINISHED", edge_id=edge.id))

    return output


async def execute_program(request: ExecutionRequest, execution_id: str) -> None:
    async def emit(event: ExecutionEvent):
        await execution_manager.emit(execution_id, event)

    try:
        await emit(ExecutionEvent(type="EXECUTION_STARTED"))

        executed: set[str] = set()

        start_node = next(
            (node for node in request.nodes if node.id == request.start_at), None
        )

        if start_node is None:
            raise ValueError(f"Start node '{request.start_at}' not found")

        await execute_node(start_node, request.nodes, request.edges, executed, emit)

        await emit(ExecutionEvent(type="EXECUTION_FINISHED"))

    except asyncio.CancelledError:
        await emit(ExecutionEvent(type="EXECUTION_CANCELLED"))
        raise

    except Exception as error:
        await emit(ExecutionEvent(type="EXECUTION_ERROR", data={"message": str(error)}))
