from pydantic_ai import RunContext
from pydantic_ai.ag_ui import StateDeps
from ag_ui.core import EventType, StateSnapshotEvent
import logging

from models.banking import BankingState, TransferDetails
from services.transfer_service import TransferService

logger = logging.getLogger("jom_kira.tools.banking")

async def prepare_transfer(
    ctx: RunContext[StateDeps[BankingState]],
    recipient_name: str,
    bank_name: str,
    account_number: str,
    amount: float,
    reference: str | None = None
) -> StateSnapshotEvent:
    """
    Prepare a bank transfer or bill payment.
    This sets the pending transaction in the state for user confirmation.
    """
    logger.info(f"💸  Executing Tool: prepare_transfer")
    logger.info(f"   ├─ Recipient: {recipient_name}")
    logger.info(f"   └─ Amount: RM {amount:,.2f}")

    details = TransferDetails(
        recipient_name=recipient_name,
        bank_name=bank_name,
        account_number=account_number,
        amount=amount,
        reference=reference
    )
    
    success, message = TransferService.prepare_transfer(ctx.deps.state, details)
    
    if not success:
        logger.error(f"❌  Transfer Preparation Failed")
        logger.error(f"   └─ Reason: {message}")
    
    return StateSnapshotEvent(
        type=EventType.STATE_SNAPSHOT,
        snapshot=ctx.deps.state,
    )

async def cancel_transfer(ctx: RunContext[StateDeps[BankingState]]) -> StateSnapshotEvent:
    """
    Cancel the pending transfer.
    """
    logger.info(f"🛑  Executing Tool: cancel_transfer")
    TransferService.cancel_transfer(ctx.deps.state)
    return StateSnapshotEvent(
        type=EventType.STATE_SNAPSHOT,
        snapshot=ctx.deps.state,
    )

async def confirm_transfer(ctx: RunContext[StateDeps[BankingState]]) -> StateSnapshotEvent:
    """
    Execute the pending transfer after user confirmation.
    """
    logger.info(f"✅  Executing Tool: confirm_transfer")
    success, message = TransferService.execute_transfer(ctx.deps.state)
    
    if not success:
        logger.error(f"❌  Transfer Confirmation Failed")
        logger.error(f"   └─ Reason: {message}")

    return StateSnapshotEvent(
        type=EventType.STATE_SNAPSHOT,
        snapshot=ctx.deps.state,
    )

def get_balance(ctx: RunContext[StateDeps[BankingState]]) -> float:
    """Get the current account balance."""
    return ctx.deps.state.balance
