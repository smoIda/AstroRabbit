import asyncio

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from astrorabbit.engine.executor import execution_manager
from astrorabbit.schemas.executor import ExecutionRequest, ExecutionResponse
from astrorabbit.services.executor import execute_program

router = APIRouter(prefix="/executor")


@router.post("/")
async def start_execution(request: ExecutionRequest):
    execution_id = execution_manager.create_execution()

    task = asyncio.create_task(execute_program(request, execution_id))

    execution_manager.register_task(execution_id, task)

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
