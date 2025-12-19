import uuid

def generate_event_id() -> str:
    """Generate a unique event ID for AG-UI messages."""
    return str(uuid.uuid4())

def generate_run_id() -> str:
    """Generate a unique run ID for AG-UI runs."""
    return str(uuid.uuid4())

def extract_text_from_json(obj) -> list[str]:
    """
    Deep search for any text-like fields in a JSON-compatible object.
    """
    texts = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            # Check common message keys
            if k in ["message", "content", "query", "text"] and isinstance(v, str):
                texts.append(v)
            else:
                texts.extend(extract_text_from_json(v))
    elif isinstance(obj, list):
        for item in obj:
            texts.extend(extract_text_from_json(item))
    return texts

def extract_last_user_message(body: dict) -> list[str]:
    """
    Specifically extracts only the content of the last user message
    from a CopilotKit AG-UI request body.
    This prevents guardrails from re-triggering on history.
    """
    messages = body.get("messages", [])
    if not messages:
        # Fallback to general extraction if no messages array
        return extract_text_from_json(body)
        
    # Find the last message with role 'user'
    for msg in reversed(messages):
        if msg.get("role") == "user":
            content = msg.get("content")
            if isinstance(content, str):
                return [content]
            elif isinstance(content, list):
                # Handle multi-modal content if necessary
                return [item.get("text", "") for item in content if isinstance(item, dict) and "text" in item]
            break
            
    return []
