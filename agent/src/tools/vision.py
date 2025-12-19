import logging
from pydantic_ai import RunContext
from pydantic_ai.ag_ui import StateDeps
from models.banking import BankingState

logger = logging.getLogger("jom_kira.tools.vision")

async def analyze_bill_image(
    ctx: RunContext[StateDeps[BankingState]],
    image_description: str
) -> str:
    """
    Mock tool to simulate analyzing a bill image.
    In a real scenario, this would use the LLM's vision capabilities.
    """
    logger.info(f"📄  Executing Tool: analyze_bill_image")
    logger.info(f"   └─ Description: {image_description[:50]}...")
    
    # For POC, we simulate extraction based on description or common billers
    desc_lower = image_description.lower()
    if "tnb" in desc_lower:
        return "I've detected a TNB bill for RM 150.50. Would you like me to prepare the payment?"
    elif "syabas" in desc_lower:
        return "I've detected a Syabas bill for RM 45.00. Would you like me to prepare the payment?"
    
    return "I couldn't clearly identify the biller. Please provide the payee and amount manually."
