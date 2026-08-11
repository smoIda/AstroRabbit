import asyncio

from astrorabbit.schemas.executor import Node, NodeOutput


async def execute_request(node: Node) -> NodeOutput:
    print(f"Executing request node {node.id}")

    await asyncio.sleep(2)

    return NodeOutput(
        node_id=node.id,
        success=True,
        data={
            "status_code": 200,
            "message": "Request completed",
        },
    )