from pydantic import BaseModel, Field
from typing import Literal

class BillDetails(BaseModel):
    """Details extracted from a bill/receipt."""
    payee_name: str = Field(description="Name of the biller (e.g. TNB, Syabas)")
    account_number: str = Field(description="Account number on the bill")
    amount: float = Field(description="Amount to be paid")
    due_date: str | None = Field(default=None, description="Due date if available")

class TransferDetails(BaseModel):
    """Details for a bank transfer."""
    recipient_name: str = Field(description="Name of the recipient")
    bank_name: str = Field(description="Name of the bank")
    account_number: str = Field(description="Recipient's account number")
    amount: float = Field(description="Amount to transfer")
    reference: str | None = Field(default=None, description="Payment reference")

class BankingState(BaseModel):
    """Current state of the banking assistant."""
    balance: float = Field(default=1000.0, description="User's current mock balance")
    pending_transfer: TransferDetails | None = Field(default=None, description="Transfer currently awaiting confirmation")
    transaction_history: list[str] = Field(default_factory=list, description="Recent transaction messages")
    status: Literal["idle", "confirming_payment", "completed", "error"] = Field(default="idle")
