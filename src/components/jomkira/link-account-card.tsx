"use client";

import { Link as LinkIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

interface LinkAccountCardProps {
  completedSteps?: number;
  totalSteps?: number;
  onLinkClick?: () => void;
}

export function LinkAccountCard({
  completedSteps = 3,
  totalSteps = 6,
  onLinkClick,
}: LinkAccountCardProps) {
  const handleLinkClick = () => {
    logger.info("Link DuitNow ID clicked");
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className="flex items-center justify-between rounded-[15px] bg-white p-5">
      <div className="flex items-center gap-4">
        <div className="border-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2">
          <LinkIcon className="text-primary h-5 w-5" />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-gray-900">
            Link DuitNow ID
          </h3>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
            <span>
              {completedSteps} of {totalSteps} completed
            </span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </div>
      <Button
        onClick={handleLinkClick}
        className="border-primary text-primary h-9 rounded-full border-2 bg-white px-5 text-xs font-bold shadow-none hover:bg-blue-50"
      >
        Link now
      </Button>
    </div>
  );
}
