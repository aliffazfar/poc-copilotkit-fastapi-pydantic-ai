"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import { logger } from "@/lib/logger";
import { useDragScroll } from "@/hooks/use-drag-scroll";
import { cn } from "@/lib/utils";

interface PromoCardProps {
  title: string;
  description: string | ReactNode;
  icon: ReactNode;
  bgColor: string;
  textColor: string;
  subTextColor: string;
  actionText?: string;
  onClick?: () => void;
  className?: string;
  id?: string;
}

export function PromoCard({
  title,
  description,
  icon,
  bgColor,
  textColor,
  subTextColor,
  actionText,
  onClick,
  className = "",
}: PromoCardProps) {
  const handleClick = () => {
    logger.info({ title }, "Promo card clicked");
    if (onClick) onClick();
  };

  return (
    <Card
      className={`relative mb-0 h-[180px] w-[150px] min-w-[160px] shrink-0 cursor-pointer overflow-hidden rounded-[15px] border-none shadow-none transition-transform active:scale-[0.98] ${className} px-0 py-2`}
      style={{ backgroundColor: bgColor }}
      onClick={handleClick}
    >
      <CardContent className="relative mb-0 flex h-full flex-col items-start px-4 pb-0">
        {/* Background Decorative Icon - Absolute positioned at bottom right */}
        <div className="pointer-events-none absolute -right-4 -bottom-4 origin-bottom-right scale-[2.2] opacity-[0.08]">
          <div style={{ color: textColor }}>{icon}</div>
        </div>

        {/* Top: Icon Container */}
        <div className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
          <div style={{ color: textColor }} className="scale-110">
            {icon}
          </div>
        </div>

        {/* Middle: Content Section (Grows to push button down) */}
        <div className="mb-2 w-full min-w-0 flex-1">
          <p
            className="mb-1 truncate text-[15px] leading-tight font-bold tracking-tight"
            style={{ color: textColor }}
          >
            {title}
          </p>
          <div
            className="line-clamp-3 text-[11px] leading-snug font-semibold opacity-90"
            style={{ color: subTextColor }}
          >
            {description}
          </div>
        </div>

        {/* Bottom: Action Button (mt-auto ensures it stays at the bottom) */}
        <div className="mt-auto shrink-0">
          {actionText && (
            <div
              className="flex items-center gap-0.5 text-[10px] font-extrabold tracking-wider uppercase"
              style={{ color: textColor }}
            >
              {actionText}{" "}
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={3} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function PromoCardsContainer({ children }: { children: ReactNode }) {
  const { scrollRef, isDragging } = useDragScroll({
    friction: 0.92,
    speedMultiplier: 1.5,
  });

  return (
    <div className="relative -mx-6">
      <div
        ref={scrollRef}
        className={cn(
          "scrollbar-hide flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-6 select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        {children}
        {/* Spacer to allow scrolling past the last card on desktop */}
        <div className="h-1 w-6 shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
}
