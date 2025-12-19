"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CURRENCY } from "@/lib/constants";

interface InChatTransferCardProps {
  recipientName: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  reference?: string;
  onApprove: () => void;
  onDecline: () => void;
  onEdit: () => void;
}

export function InChatTransferCard({
  recipientName,
  bankName,
  accountNumber,
  amount,
  reference,
  onApprove,
  onDecline,
  onEdit,
}: InChatTransferCardProps) {
  return (
    <div className="space-y-3">
      {/* <div className="flex justify-start">
        <div className="max-w-[90%] rounded-[15px] rounded-bl-sm border border-white/60 bg-white/40 px-4 py-3 shadow-sm backdrop-blur-md">
          <div className="text-[15px] leading-relaxed font-medium text-black">
            <p>Let's double-check your transfer details before sending.</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">
              By approving, you're agreeing to the <br />
              <a href="#" className="text-blue-600 hover:underline">
                DuitNow Terms and Conditions
              </a>
              .
            </p>
          </div>
        </div>
      </div> */}
      <Card className="w-full max-w-[90%] gap-0 overflow-hidden rounded-[15px] border border-white/30 bg-white/40 p-1 text-slate-900">
        {/* Transfer Details Card */}
        <CardContent className="p-2">
          <div className="px-2 py-2">
            {/* Header */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[9px] font-extrabold tracking-widest text-slate-500 uppercase">
                Transfer
              </span>
              <Badge
                variant="secondary"
                className="h-4 border-none bg-blue-500/20 text-[8px] font-bold tracking-tight text-blue-700 uppercase"
              >
                Fund Transfer
              </Badge>
            </div>

            {/* Amount */}
            <div className="mb-1">
              <span className="text-3xl font-extrabold tracking-tighter text-slate-900">
                {CURRENCY} {amount.toFixed(2)}
              </span>
            </div>

            {/* Reference */}
            <p className="mb-4 text-[10px] font-semibold text-slate-500">
              Reference: {reference || "Funds Transfer"}
            </p>

            {/* Recipient */}
            <div className="mx-0 flex items-center gap-2.5 rounded-[10px] border-1 p-2.5">
              <div className="relative">
                <Avatar className="h-9 w-9 border border-white/60 shadow-sm">
                  <AvatarFallback className="bg-yellow-400 text-xs font-bold text-black">
                    {bankName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-extrabold text-slate-900">
                  {recipientName.toUpperCase()}
                </p>
                <p className="text-[10px] font-semibold text-slate-500">
                  {accountNumber} · {bankName}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Action Buttons */}
        <CardFooter className="flex justify-between gap-2 p-3 pt-1">
          <div className="flex gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-[12px] font-bold text-red-500 transition-colors hover:bg-red-500/10"
              onClick={onDecline}
            >
              Decline
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-[12px] font-bold text-slate-500 transition-colors hover:bg-slate-500/10"
              onClick={onEdit}
            >
              Edit
            </Button>
          </div>
          <Button
            size="sm"
            className="h-8 rounded-full bg-white/10 px-5 text-[12px] font-bold text-black shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/80 active:scale-[0.98]"
            onClick={onApprove}
          >
            Approve
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
