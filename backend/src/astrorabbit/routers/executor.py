import asyncio

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse


from astrorabbit.engine.executor import execution_manager
from astrorabbit.schemas.executor import (
    ExecutionRequest,
    ExecutionResponse,
    ExecutionState,
)
from astrorabbit.services.executor import execute_program

router = APIRouter(prefix="/executor")


@router.post("/")
async def start_execution(request: ExecutionRequest):
    execution_id = execution_manager.create_execution()

    state = ExecutionState()

    task = asyncio.create_task(execute_program(request, execution_id, state))

    execution_manager.register_task(execution_id, task)
    execution_manager.register_state(execution_id, state)

    return ExecutionResponse(execution_id=execution_id)


@router.get("/{execution_id}/events")
async def stream_execution(execution_id: str):
    queue = execution_manager.get_queue(execution_id)

    if queue is None:
        raise HTTPException(status_code=404, detail="Execution ID not found")

    async def event_generator():
        try:
            while True:
                event = await queue.get()

                payload = event.model_dump_json(by_alias=True)

                yield f"data: {payload}\n\n"

                if event.type in {
                    "EXECUTION_FINISHED",
                    "EXECUTION_CANCELLED",
                    "EXECUTION_ERROR",
                }:
                    break

        finally:
            # handle client disconnection here yo yo
            pass

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )


@router.post("/{execution_id}/cancel")
async def cancel_execution(execution_id: str):
    task = execution_manager.get_task(execution_id)

    if task is None:
        raise HTTPException(status_code=404, detail="Execution ID not found")

    if task.done():
        return {"status": "Specified execution ID has already finished"}

    task.cancel()

    return {"status": "Cancellation requested"}


@router.post("/{execution_id}/nodes/{node_id}/skip")
async def skip_node_execution(execution_id: str, node_id: str):
    state = execution_manager.get_state(execution_id)

    if state is None:
        raise HTTPException(status_code=404, detail="Execution not found")

    skip_event = state.skip_events.setdefault(
        node_id,
        asyncio.Event(),
    )

    skip_event.set()

    return {"status": f"{node_id} in {execution_id} is skipped"}
