"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { CURRENCY } from "@/lib/constants";
import { ActionButton } from "./action-buttons";
import { logger } from "@/lib/logger";
import { ActionButton as ActionButtonType } from "@/lib/types";

interface BalanceCardProps {
  balance: number;
  interestEarned?: number;
  onBalanceClick?: () => void;
  onViewDetailsClick?: () => void;
  actions: ActionButtonType[];
}

export function BalanceCard({
  balance,
  interestEarned = 0.43,
  onBalanceClick,
  onViewDetailsClick,
  actions,
}: BalanceCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const formattedBalance = useMemo(() => {
    const balanceStr = balance.toLocaleString("en-MY", {
      minimumFractionDigits: 2,
    });
    if (isBalanceVisible) return balanceStr;
    return balanceStr.replace(/\d/g, "*");
  }, [balance, isBalanceVisible]);

  const handleBalanceClick = () => {
    logger.info("Balance section clicked");
    if (onBalanceClick) onBalanceClick();
  };

  const handleViewDetailsClick = () => {
    const newState = !isBalanceVisible;
    logger.info({ isVisible: newState }, "Balance visibility toggled");
    setIsBalanceVisible(newState);
    if (onViewDetailsClick) onViewDetailsClick();
  };

  return (
    <div className="relative">
      <Card className="rounded-[24px] border-none bg-[#eaf3ff] shadow-none">
        <CardContent className="flex flex-col items-center px-4 py-2">
          {/* Total Balance Label */}
          <button
            className="mb-4 flex items-center gap-1.5 text-gray-900 transition-colors hover:text-gray-600"
            onClick={handleBalanceClick}
          >
            <span className="text-sm font-medium">Total balance</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Balance Amount */}
          <div className="mb-4 flex items-center justify-center gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-[36px] leading-none font-bold tracking-tighter text-gray-900 transition-all duration-300 ease-in-out">
                {CURRENCY} {formattedBalance}
              </span>
            </div>
            <button
              className="-mr-8 rounded-full p-1.5 transition-colors"
              onClick={handleViewDetailsClick}
            >
              {isBalanceVisible ? (
                <Eye className="h-6 w-6 text-gray-500" />
              ) : (
                <EyeOff className="h-6 w-6 text-gray-500" />
              )}
            </button>
          </div>

          {/* Interest Earned */}
          <div className="mb-7 flex items-center justify-center gap-2 rounded-full px-3">
            <span className="text-sm font-medium text-gray-900">
              Interest earned
            </span>
            <span className="text-jomkira-green text-sm font-bold">
              +{CURRENCY} {interestEarned.toFixed(2)}
            </span>
          </div>

          {/* Actions Grid */}
          <div className="grid w-full grid-cols-4 px-4 py-2">
            {actions.map((action, idx) => (
              <ActionButton key={idx} {...action} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
