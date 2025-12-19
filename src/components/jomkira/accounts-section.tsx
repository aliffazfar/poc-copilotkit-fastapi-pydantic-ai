"use client";

import { AccountItem } from "@/lib/types";
import { AccountListItem } from "./account-list-item";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

interface AccountsSectionProps {
  title?: string;
  accounts: AccountItem[];
  onViewAll?: () => void;
  onAccountClick?: (item: AccountItem) => void;
}

export function AccountsSection({
  title = "Accounts",
  accounts,
  onViewAll,
  onAccountClick,
}: AccountsSectionProps) {
  const handleViewAll = () => {
    logger.info("View all accounts clicked");
    onViewAll?.();
  };

  return (
    <div className="space-y-3 px-2">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <div className="rounded-[15px] bg-white px-4.5 py-5">
        <div className="divide-y divide-gray-100">
          {accounts.map((account) => (
            <AccountListItem
              key={account.id}
              item={account}
              onClick={onAccountClick}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-center">
          <Button
            variant="ghost"
            onClick={handleViewAll}
            className="text-primary h-auto p-0 text-[15px] font-bold hover:bg-transparent hover:text-blue-700"
          >
            View all
          </Button>
        </div>
      </div>
    </div>
  );
}
