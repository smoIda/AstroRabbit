import asyncio

from nanoid import generate

from astrorabbit.schemas.executor import ExecutionEvent


class ExecutionManager:
    def __init__(self):
        self.queues: dict[str, asyncio.Queue[ExecutionEvent]] = {}
        self.tasks: dict[str, asyncio.Task[None]] = {}

    def create_execution(self) -> str:
        execution_id = generate()

        self.queues[execution_id] = asyncio.Queue()

        return execution_id

    def remove_execution(self, execution_id: str):
        self.queues.pop(execution_id, None)
        self.tasks.pop(execution_id, None)

    def register_task(self, execution_id: str, task: asyncio.Task[None]):
        self.tasks[execution_id] = task

    def get_task(self, execution_id: str) -> asyncio.Task[None] | None:
        return self.tasks.get(execution_id)

    def get_queue(self, execution_id: str) -> asyncio.Queue[ExecutionEvent] | None:
        return self.queues.get(execution_id)

    async def emit(self, execution_id: str, event: ExecutionEvent):
        queue = self.queues.get(execution_id)

        if queue is None:
            return

        await queue.put(event)


execution_manager = ExecutionManager()
