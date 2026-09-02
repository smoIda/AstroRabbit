import asyncio
from http import HTTPStatus
import random

import httpx

from fastapi import status

from astrorabbit.config.executor import MAX_HTTP_TIMEOUT
from astrorabbit.schemas.executor import NodeResult
from astrorabbit.schemas.node_schemas.http_request import (
    HttpMockConfig,
    HttpCustomConfig,
    HttpRequestNode,
    HttpRequestOutput,
)


async def execute_mock_request(config: HttpMockConfig) -> NodeResult[HttpRequestOutput]:
    await asyncio.sleep(config.latency)

    gamble = random.choices(
        ["SUCCESS", "FAIL"],
        weights=[100 - config.failure_rate, config.failure_rate],
        k=1,
    )[0]

    try:
        status_reason = HTTPStatus(config.status_code).phrase
    except:
        status_reason = "Custom Status"

    success = gamble == "SUCCESS" and 200 <= config.status_code < 300

    return NodeResult(
        success=success,
        output=HttpRequestOutput(
            status_code=config.status_code,
            status_reason=status_reason,
            body=config.body,
        ),
    )


async def execute_custom_request(
    config: HttpCustomConfig,
) -> NodeResult[HttpRequestOutput]:
    async with httpx.AsyncClient() as client:
        # https://httpbingo.org/get - SUCCESS
        # https://httpbingo.org/status/500 - ERROR, STATUS 500
        # https://httpbingo.org/delay/10 - ERROR, TIME OUT

        try:
            response = await client.get(config.url, timeout=MAX_HTTP_TIMEOUT)
        except httpx.TimeoutException:
            return NodeResult(
                success=False,
                output=HttpRequestOutput(
                    status_code=status.HTTP_408_REQUEST_TIMEOUT,
                    status_reason="Request Timeout",
                    body={"error": "Request timed out"},
                ),
            )
        except httpx.RequestError as err:
            return NodeResult(
                success=False,
                output=HttpRequestOutput(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    status_reason="Bad Gateway",
                    body={"error": str(err)},
                ),
            )

    try:
        body = response.json()
    except ValueError:
        body = {"raw": response.text}

    return NodeResult(
        success=response.is_success,
        output=HttpRequestOutput(
            status_code=response.status_code,
            status_reason=response.reason_phrase,
            headers=dict(response.headers),
            body=body,
        ),
    )


async def execute_request(node: HttpRequestNode) -> NodeResult[HttpRequestOutput]:
    config = node.data.config

    match config.provider:
        case "MOCK_API":
            return await execute_mock_request(config)
        case "CUSTOM_API":
            return await execute_custom_request(config)
        case _:
            raise ValueError(f"Unsupported HTTP provider: {config.provider}")
