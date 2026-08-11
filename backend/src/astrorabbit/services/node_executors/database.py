import asyncio

from astrorabbit.schemas.executor import Node, NodeOutput


async def execute_database(node: Node) -> NodeOutput:
    print(f"Executing database node {node.id}")

    await asyncio.sleep(3)

    return NodeOutput(
        node_id=node.id,
        success=True,
        data={
            "rows": 5,
            "message": "Database query completed",
        },
    )
