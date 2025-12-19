"use client";

import { ActionButton as ActionButtonType } from "@/lib/types";
import { logger } from "@/lib/logger";

interface ActionButtonProps extends ActionButtonType {
  className?: string;
}

export function ActionButton({ label, icon: Icon, onClick, id, className = "" }: ActionButtonProps) {
  const handleActionClick = () => {
    logger.info({ action: label, id }, "Action button clicked");
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`flex flex-col items-center gap-3 group cursor-pointer ${className}`}
      onClick={handleActionClick}
    >
      <div className="w-[60px] h-[60px] rounded-full bg-primary flex items-center justify-center shadow-[0_4px_16px_rgba(0,85,255,0.2)] group-active:scale-95 transition-all duration-200">
        <Icon className="w-7 h-7 text-white" strokeWidth={2} />
      </div>
      <span className="text-[11px] font-medium text-gray-500 tracking-wide">{label}</span>
    </div>
  );
}
