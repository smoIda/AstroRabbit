import asyncio

import time
from typing import Awaitable, Callable

from astrorabbit.exceptions.executor import NodeErrorException, NodeSkippedException
from astrorabbit.engine.executor import execution_manager
from astrorabbit.schemas.executor import (
    Node,
    ExecutionState,
    ExecutionRequest,
    ExecutionEvent,
    ExecutionStartedEvent,
    ExecutionSuccessEvent,
    ExecutionErrorEvent,
    ExecutionCancelledEvent,
    NodeSkippedEvent,
    NodeStartedEvent,
    NodeSuccessEvent,
    NodeErrorEvent,
    EdgeStartedEvent,
    EdgeFinishedEvent,
    NodeResult,
)
from astrorabbit.schemas.node_schemas.database import DatabaseOutput
from astrorabbit.schemas.node_schemas.http_request import HttpRequestOutput
from astrorabbit.services.node_executors.database import execute_database
from astrorabbit.services.node_executors.http_request import execute_request


async def execute_program(
    request: ExecutionRequest, execution_id: str, state: ExecutionState
) -> None:
    async def emit(event: ExecutionEvent):
        await execution_manager.emit(execution_id, event)

    try:
        await emit(ExecutionStartedEvent())

        start_node = next(
            (node for node in request.nodes if node.id == request.start_at), None
        )

        if start_node is None:
            raise ValueError(f"Start node '{request.start_at}' not found")

        await execute_node(start_node, state, emit)

        await traverse_edge(start_node, request, state, emit)

        await emit(ExecutionSuccessEvent())

    except NodeErrorException:
        await emit(ExecutionErrorEvent(output="Encountered node error"))

    except asyncio.CancelledError:
        await emit(ExecutionCancelledEvent())
        raise

    except Exception as error:
        await emit(ExecutionErrorEvent(output=str(error)))


async def execute_node(
    node: Node,
    state: ExecutionState,
    emit: Callable[[ExecutionEvent], Awaitable[None]],
) -> NodeResult[HttpRequestOutput] | NodeResult[DatabaseOutput] | None:
    if node.id in state.executed:
        return

    await emit(NodeStartedEvent(node_id=node.id))

    result = None

    start_time = time.perf_counter()

    skip_event = state.skip_events.setdefault(
        node.id,
        asyncio.Event(),
    )

    try:
        match node.type:
            case "HTTP_REQUEST":
                node_task = asyncio.create_task(execute_request(node))
            case "DATABASE":
                node_task = asyncio.create_task(execute_database(node, state.output))
            case _:
                raise ValueError(f"Unsupported node type: {node.type}")

        skip_task = asyncio.create_task(skip_event.wait())

        done, _ = await asyncio.wait(
            {node_task, skip_task}, return_when=asyncio.FIRST_COMPLETED
        )

        if skip_task in done:
            node_task.cancel()

            try:
                await node_task

            except asyncio.CancelledError:
                pass

            raise NodeSkippedException(f"{node.id} is skipped")

        skip_task.cancel()

        result = await node_task

    except NodeSkippedException:
        duration = time.perf_counter() - start_time

        await emit(NodeSkippedEvent(node_id=node.id, duration=duration))

        result = None

        # connected_edges = [edge for edge in request.edges if edge.source == node.id]
        # for edge in connected_edges:
        #     await emit(EdgeSkippedEvent(edge_id=edge.id))

    except asyncio.CancelledError:
        raise

    except Exception as error:
        duration = time.perf_counter() - start_time

        await emit(
            NodeErrorEvent(
                node_id=node.id,
                duration=duration,
                output=str(error),
            )
        )
        raise

    duration = time.perf_counter() - start_time

    state.executed.add(node.id)

    if result is not None:
        state.output[node.id] = result

        if not result.success:
            await emit(
                NodeErrorEvent(
                    node_id=node.id,
                    duration=duration,
                    output=result.output.model_dump(),
                )
            )

            raise NodeErrorException(f"{node.id} failed to execute")

        await emit(
            NodeSuccessEvent(
                node_id=node.id,
                duration=duration,
                output=result.output,
            )
        )

    return result


async def traverse_edge(
    node: Node,
    request: ExecutionRequest,
    state: ExecutionState,
    emit: Callable[[ExecutionEvent], Awaitable[None]],
):
    outgoing_edges = [edge for edge in request.edges if edge.source == node.id]

    for edge in outgoing_edges:
        await emit(EdgeStartedEvent(edge_id=edge.id))

        next_node = next(
            (candidate for candidate in request.nodes if candidate.id == edge.target),
            None,
        )

        if next_node is None:
            raise ValueError(f"Target node '{edge.target}' not found")

        await execute_node(
            next_node,
            state,
            emit,
        )

        await emit(EdgeFinishedEvent(edge_id=edge.id))

        await traverse_edge(
            next_node,
            request,
            state,
            emit,
        )
