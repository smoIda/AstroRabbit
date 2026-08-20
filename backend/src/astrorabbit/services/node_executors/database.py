import asyncio
from typing import Any

from astrorabbit.schemas.executor import NodeResult
from astrorabbit.schemas.node_schemas.database import DatabaseNode, DatabaseOutput


async def execute_database(
    node: DatabaseNode, output: dict[str, Any]
) -> NodeResult[DatabaseOutput]:
    try:
        await asyncio.sleep(3)

        return NodeResult(success=True, output=DatabaseOutput(body=output.copy()))

    except Exception as error:
        return NodeResult(success=False, output=DatabaseOutput(body=str(error)))
