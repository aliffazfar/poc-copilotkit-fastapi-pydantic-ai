"use client";

import { useCoAgent } from "@copilotkit/react-core";
import { BankingState } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";
import { CURRENCY, BANKING_ACTIONS } from "@/lib/constants";
import { logger } from "@/lib/logger";

export function TransferConfirmationCard() {
  const { state, run } = useCoAgent<BankingState>({
    name: "jom_kira_agent",
  });

  if (state.status !== "confirming_payment" || !state.pending_transfer) {
    return null;
  }

  const { recipient_name, bank_name, amount, account_number, reference } = state.pending_transfer;

  const handleConfirm = () => {
    logger.info({
        amount,
        bank_name,
        has_reference: !!reference
    }, "Transfer confirmed by user");
    run(BANKING_ACTIONS.CONFIRM_TRANSFER);
  };

  const handleCancel = () => {
    logger.info("Transfer cancelled by user");
    run(BANKING_ACTIONS.CANCEL_TRANSFER);
  };

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden border-none shadow-lg rounded-[24px] bg-white animate-fade-in">
      <div className="bg-gradient-to-r from-primary to-[#0044CC] p-6 text-white text-center relative overflow-hidden">
         <div className="relative z-10">
            <h3 className="text-sm font-semibold opacity-90 uppercase tracking-widest">Confirmation</h3>
            <div className="flex items-baseline justify-center gap-1 mt-2">
                <span className="text-2xl font-bold">{CURRENCY}</span>
                <span className="text-5xl font-bold tracking-tight">{amount.toFixed(2)}</span>
            </div>
         </div>
         {/* Decorative Circle */}
         <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <CardContent className="p-6 space-y-6">
        
        {/* Recipient Details */}
        <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-gray-100">
                <AvatarFallback className="bg-gray-50 text-gray-500 font-bold text-lg">
                    {recipient_name.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">To</p>
                <p className="text-lg font-bold text-gray-900 leading-tight">{recipient_name}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{bank_name} • {account_number}</p>
            </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 w-full"></div>

        {/* Reference */}
        {reference && (
            <div className="flex items-start justify-between">
                <span className="text-sm text-gray-500 font-medium">Reference</span>
                <span className="text-sm text-gray-900 font-semibold max-w-[60%] text-right">{reference}</span>
            </div>
        )}

      </CardContent>

      <CardFooter className="p-6 pt-0 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="w-full rounded-full h-12 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:text-gray-900"
          onClick={handleCancel}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          className="w-full rounded-full h-12 bg-primary hover:bg-[#0044CC] text-white font-bold shadow-lg shadow-blue-500/30"
          onClick={handleConfirm}
        >
          <Check className="w-4 h-4 mr-2 stroke-[3px]" />
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
}
