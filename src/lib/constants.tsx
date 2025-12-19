import { env } from "@/lib/env";

export const APP_NAME = env.NEXT_PUBLIC_APP_NAME || "Jom Kira";
export const APP_DESCRIPTION = "Your Smart Digital Bank Assistant";

export const CURRENCY = "RM";

export const BANKING_ACTIONS = {
  CONFIRM_TRANSFER: "confirm_transfer",
  CANCEL_TRANSFER: "cancel_transfer",
  EDIT_TRANSFER: "edit_transfer",
} as const;
