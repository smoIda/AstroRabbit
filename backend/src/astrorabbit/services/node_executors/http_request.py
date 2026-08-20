import asyncio
import random

import httpx

from astrorabbit.config.executor import MAX_HTTP_TIMEOUT
from astrorabbit.schemas.executor import NodeResult
from astrorabbit.schemas.node_schemas.http_request import (
    HttpCustomData,
    HttpMockData,
    HttpRequestNode,
    HttpRequestOutput,
)


async def execute_mock_request(data: HttpMockData) -> NodeResult[HttpRequestOutput]:
    await asyncio.sleep(data.config.latency)

    gamble = random.choices(
        ["SUCCESS", "FAIL"],
        weights=[100 - data.config.failure_rate, data.config.failure_rate],
        k=1,
    )[0]

    success = gamble == "SUCCESS" and 200 <= data.config.status_code < 300

    return NodeResult(
        success=success,
        output=HttpRequestOutput(
            status_code=data.config.status_code,
            body={
                "message:": "Hello from Mock API",
                "latency:": data.config.latency,
                "rolled:": gamble,
            },
        ),
    )


async def execute_custom_request(
    data: HttpCustomData,
) -> NodeResult[HttpRequestOutput]:
    async with httpx.AsyncClient() as client:
        # https://httpbingo.org/get - SUCCESS
        # https://httpbingo.org/status/500 - ERROR, STATUS 500
        # https://httpbingo.org/delay/10 - ERROR, TIME OUT
        response = await client.get(data.config.url, timeout=MAX_HTTP_TIMEOUT)

        response.raise_for_status()

        return NodeResult(
            success=True,
            output=HttpRequestOutput(
                status_code=response.status_code,
                body=response.json(),
            ),
        )


async def execute_request(node: HttpRequestNode) -> NodeResult[HttpRequestOutput]:
    match node.data:
        case HttpMockData():
            return await execute_mock_request(node.data)
        case HttpCustomData():
            return await execute_custom_request(node.data)
        case _:
            raise ValueError(f"Unsupported HTTP provider: {node.data.provider}")
