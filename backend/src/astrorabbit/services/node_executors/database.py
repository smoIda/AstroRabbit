import asyncio
import json
from typing import Any

import duckdb

from astrorabbit.schemas.executor import NodeResult
from astrorabbit.schemas.node_schemas.database import DatabaseNode, DatabaseOutput


async def execute_database(
    node: DatabaseNode, input: dict[str, Any]
) -> NodeResult[DatabaseOutput]:
    try:

        def query():
            with duckdb.connect(":memory:") as con:
                json_data = json.dumps(list(input.values()))

                result = con.execute(
                    """
                    SELECT value
                    FROM json_each(?::JSON)
                    """,
                    [json_data],
                )

                cols = [col[0] for col in result.description]
                rows = result.fetchall()

                return [dict(zip(cols, row)) for row in rows]

        result = await asyncio.to_thread(query)

        return NodeResult(
            success=True,
            output=DatabaseOutput(body=result),
        )

    except Exception as err:
        return NodeResult(
            success=False,
            output=DatabaseOutput(body={"err": str(err)}),
        )
