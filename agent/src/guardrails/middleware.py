import logging
import json
from guardrails.registry import GuardrailRegistry
from guardrails.base import GuardrailContext
from core.agui_events import AGUISSEBuilder
from utils.agui import extract_last_user_message

# Import guardrails to register them
from guardrails.checks.sanitization import SanitizationGuardrail

logger = logging.getLogger("jom_kira.guardrails.middleware")

# Initialize registry and register guardrails
# Note: In a larger app, this registration could happen in a separate config or startup script
GuardrailRegistry.register(SanitizationGuardrail())

class GuardrailMiddleware:
    """
    ASGI Middleware for guardrail enforcement with AG-UI SSE responses.
    
    Responsibilities:
    1. Buffer incoming request body
    2. Run all registered guardrails via GuardrailRegistry
    3. Return proper AG-UI SSE stream for blocked requests
    4. Pass through allowed requests to the app
    """
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        # Only intercept HTTP POST requests (where chat input/JSON lives)
        if scope["type"] != "http" or scope["method"] != "POST":
            return await self.app(scope, receive, send)
        
        body, messages = await self._buffer_request(receive)
        
        # Prepare context and run guardrails
        guardrail_error_message = self._run_guardrails(body)
        
        if guardrail_error_message:
            return await self._send_guardrail_response(send, guardrail_error_message)
        
        # Create replay receive for downstream handlers
        async def replay_receive():
            if messages:
                return messages.pop(0)
            return await receive()
        
        return await self.app(scope, replay_receive, send)
    
    async def _buffer_request(self, receive) -> tuple[bytes, list]:
        """Buffer the entire request body for inspection."""
        body = b""
        messages = []
        more_body = True
        
        try:
            while more_body:
                message = await receive()
                messages.append(message)
                if message["type"] == "http.request":
                    body += message.get("body", b"")
                    more_body = message.get("more_body", False)
                elif message["type"] == "http.disconnect":
                    more_body = False
        except Exception as e:
            logger.debug(f"Error buffering request body: {e}")
            
        return body, messages
    
    def _run_guardrails(self, body: bytes) -> str | None:
        """
        Run all registered guardrail checks.
        Returns an error message string if blocked, None if allowed.
        """
        if not body:
            return None
        
        try:
            body_json = json.loads(body)
            text_candidates = extract_last_user_message(body_json)
            
            context = GuardrailContext(
                body=body_json,
                text_candidates=text_candidates,
                metadata={"ip": "N/A"} # Could be enhanced with real scope data
            )
            
            result = GuardrailRegistry.run_all(context)
            if not result.passed:
                return result.error_message
                
        except Exception as e:
            logger.debug(f"Guardrail execution error: {e}")
        
        return None
    
    async def _send_guardrail_response(self, send, message: str):
        """Send a proper AG-UI SSE stream for guardrail responses."""
        builder = AGUISSEBuilder()
        events = builder.build_text_response(message)
        
        # Start SSE response
        await send({
            "type": "http.response.start",
            "status": 200,
            "headers": [
                [b"content-type", b"text/event-stream"],
                [b"cache-control", b"no-cache"],
                [b"connection", b"keep-alive"],
                [b"x-accel-buffering", b"no"],
            ],
        })
        
        # Send events
        for event in events:
            await send({
                "type": "http.response.body",
                "body": AGUISSEBuilder.format_sse(event),
                "more_body": True,
            })
        
        # Close stream
        await send({
            "type": "http.response.body",
            "body": b"",
            "more_body": False,
        })
