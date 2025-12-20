"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CURRENCY } from "@/lib/constants";
import { Zap, Building2, Droplet, Wifi, CreditCard } from "lucide-react";

type PaymentType = "transfer" | "bill";

interface BillerConfig {
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

interface InChatPaymentCardProps {
  type: PaymentType;

  // Common fields
  amount: number;
  reference?: string;

  // Transfer-specific fields (when type="transfer")
  recipientName?: string;
  bankName?: string;
  accountNumber?: string;

  // Bill-specific fields (when type="bill")
  billerName?: string;
  billerAccountNumber?: string;
  dueDate?: string;

  // Actions
  onApprove: () => void;
  onDecline: () => void;
  onEdit: () => void;
}

// Map biller names to icons and colors using switch case
function getBillerConfig(billerName: string): BillerConfig {
  const name = billerName.toLowerCase();

  // Determine biller type
  type BillerType =
    | "electricity"
    | "water"
    | "telecom"
    | "entertainment"
    | "default";

  const getBillerType = (billerNameLower: string): BillerType => {
    switch (true) {
      case billerNameLower.includes("tenaga"):
      case billerNameLower.includes("tnb"):
        return "electricity";

      case billerNameLower.includes("syabas"):
      case billerNameLower.includes("water"):
      case billerNameLower.includes("air"):
        return "water";

      case billerNameLower.includes("tm"):
      case billerNameLower.includes("unifi"):
      case billerNameLower.includes("celcom"):
      case billerNameLower.includes("maxis"):
      case billerNameLower.includes("digi"):
        return "telecom";

      case billerNameLower.includes("astro"):
        return "entertainment";

      default:
        return "default";
    }
  };

  const billerType = getBillerType(name);

  switch (billerType) {
    case "electricity":
      return {
        icon: <Zap className="h-4 w-4" />,
        bgColor: "bg-yellow-400",
        textColor: "text-yellow-900",
      };

    case "water":
      return {
        icon: <Droplet className="h-4 w-4" />,
        bgColor: "bg-blue-400",
        textColor: "text-blue-900",
      };

    case "telecom":
      return {
        icon: <Wifi className="h-4 w-4" />,
        bgColor: "bg-purple-400",
        textColor: "text-purple-900",
      };

    case "entertainment":
      return {
        icon: <CreditCard className="h-4 w-4" />,
        bgColor: "bg-red-400",
        textColor: "text-red-900",
      };

    case "default":
    default:
      return {
        icon: <Building2 className="h-4 w-4" />,
        bgColor: "bg-slate-400",
        textColor: "text-slate-900",
      };
  }
}

export function InChatPaymentCard({
  type,
  amount,
  reference,
  recipientName,
  bankName,
  accountNumber,
  billerName,
  billerAccountNumber,
  dueDate,
  onApprove,
  onDecline,
  onEdit,
}: InChatPaymentCardProps) {
  // Get display values based on payment type using switch
  const getDisplayConfig = () => {
    switch (type) {
      case "transfer":
        return {
          isTransfer: true,
          isBill: false,
          displayName: recipientName,
          displayAccount: accountNumber,
          displaySubtitle: bankName,
          badgeText: "Fund Transfer",
          badgeBg: "bg-blue-500/20",
          badgeTextColor: "text-blue-700",
          headerText: "Transfer",
          approveText: "Approve",
          referenceText: reference || "Funds Transfer",
          avatarBg: "bg-yellow-400",
          avatarText: "text-black",
          avatarContent: bankName?.charAt(0) || "?",
        };

      case "bill":
      default: {
        const billerConfig = billerName ? getBillerConfig(billerName) : null;
        return {
          isTransfer: false,
          isBill: true,
          displayName: billerName,
          displayAccount: billerAccountNumber,
          displaySubtitle: dueDate ? `Due: ${dueDate}` : undefined,
          badgeText: "Bill Payment",
          badgeBg: "bg-orange-500/20",
          badgeTextColor: "text-orange-700",
          headerText: "Bill Payment",
          approveText: "Pay Now",
          referenceText: dueDate
            ? `Due: ${dueDate}`
            : reference || "Bill Payment",
          avatarBg: billerConfig?.bgColor || "bg-slate-400",
          avatarText: billerConfig?.textColor || "text-slate-900",
          avatarContent: billerConfig?.icon || (
            <Building2 className="h-4 w-4" />
          ),
        };
      }
    }
  };

  const config = getDisplayConfig();

  return (
    <div className="space-y-3">
      <Card className="w-full max-w-[90%] gap-0 overflow-hidden rounded-[15px] border border-white/30 bg-white/40 p-1 text-slate-900">
        {/* Payment Details Card */}
        <CardContent className="p-2">
          <div className="px-2 py-2">
            {/* Header */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[9px] font-extrabold tracking-widest text-slate-500 uppercase">
                {config.headerText}
              </span>
              <Badge
                variant="secondary"
                className={`h-4 border-none ${config.badgeBg} text-[8px] font-bold tracking-tight ${config.badgeTextColor} uppercase`}
              >
                {config.badgeText}
              </Badge>
            </div>

            {/* Amount */}
            <div className="mb-1">
              <span className="text-3xl font-extrabold tracking-tighter text-slate-900">
                {CURRENCY} {amount.toFixed(2)}
              </span>
            </div>

            {/* Reference / Due Date Info */}
            <p className="mb-4 text-[10px] font-semibold text-slate-500">
              {config.referenceText}
            </p>

            {/* Recipient / Biller */}
            <div className="mx-0 flex items-center gap-2.5 rounded-[10px] border-1 p-2.5">
              <div className="relative">
                <Avatar className="h-9 w-9 border border-white/60 shadow-sm">
                  <AvatarFallback
                    className={`${config.avatarBg} ${config.avatarText} flex items-center justify-center text-xs font-bold`}
                  >
                    {config.avatarContent}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-extrabold text-slate-900">
                  {(config.displayName || "Unknown").toUpperCase()}
                </p>
                <p className="text-[10px] font-semibold text-slate-500">
                  {config.displayAccount || "N/A"}
                  {config.isTransfer &&
                    config.displaySubtitle &&
                    ` · ${config.displaySubtitle}`}
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
            {config.approveText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
