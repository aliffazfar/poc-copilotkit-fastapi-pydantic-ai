"use client";

import { AccountItem } from "@/lib/types";
import { CURRENCY } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AccountListItemProps {
  item: AccountItem;
  onClick?: (item: AccountItem) => void;
}

export function AccountListItem({ item, onClick }: AccountListItemProps) {
  const {
    name,
    subtitle,
    amount,
    badge,
    iconBgColor,
    iconColor = "text-white",
    icon: Icon,
  } = item;

  return (
    <button
      onClick={() => onClick?.(item)}
      className="mx-0 flex w-full items-center justify-between py-4 pt-0 transition-colors hover:bg-gray-50/50"
    >
      <div className="flex items-center gap-4">
        {/* Circle Icon */}
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
            iconBgColor
          )}
        >
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>

        {/* Name and Subtitle */}
        <div className="text-left">
          <h4 className="text-[15px] font-bold text-gray-900">{name}</h4>
          {subtitle && (
            <p className="text-xs font-medium text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Amount and Badge */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-[15px] font-bold text-gray-900">
          {CURRENCY}{" "}
          {amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}
        </span>
        {badge && (
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}
