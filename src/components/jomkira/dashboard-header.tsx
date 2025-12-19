"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Sparkles, X, MessageSquarePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { logger } from "@/lib/logger";

interface DashboardHeaderProps {
  onAskAIClick: () => void;
  onAvatarClick?: () => void;
  onNotificationClick?: () => void;
  onCloseChat?: () => void;
  onNewChat?: () => void;
  userInitials?: string;
  hasNotification?: boolean;
  isChatOpen?: boolean;
  children?: React.ReactNode;
}

export function DashboardHeader({
  onAskAIClick,
  onAvatarClick,
  onNotificationClick,
  onCloseChat,
  onNewChat,
  userInitials = "AA",
  hasNotification = true,
  isChatOpen = false,
  children,
}: DashboardHeaderProps) {

  const handleAskAIClick = () => {
    logger.info("Ask AI clicked");
    onAskAIClick();
  };

  const handleAvatarClick = () => {
    logger.info("Avatar clicked");
    if (onAvatarClick) onAvatarClick();
  };

  const handleNotificationClick = () => {
    logger.info("Notification clicked");
    if (onNotificationClick) onNotificationClick();
  };

  const handleCloseChat = () => {
    logger.info("Chat closed");
    if (onCloseChat) onCloseChat();
  };

  const handleNewChat = () => {
    logger.info("New chat clicked");
    if (onNewChat) onNewChat();
  };

  return (
    <div
      className={`relative z-[60] flex flex-col transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isChatOpen ? "fixed inset-0 h-[100dvh]" : "h-auto"
      }`}
    >
      {/* 1. Unified Background (Radial Aurora - Always the same) */}
      <div
        className="absolute inset-0 -z-10 h-full w-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          background:
            "radial-gradient(100% 100% at 50% 0%, #E0F2FE 0%, #F3E8FF 40%, #F2F5F9 100%)",
        }}
      />

      {/* 2. Unified Header Bar (Fixed positions for all elements) */}
      <div
        className={`relative z-20 flex items-center justify-between px-4 pt-7 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isChatOpen ? "pb-10" : "pb-6"
        }`}
      >
        {/* Left: Avatar <-> Close X */}
        <div className="relative h-9 w-9">
          <Avatar
            onClick={handleAvatarClick}
            className={`absolute inset-0 h-9 w-9 cursor-pointer border border-white/60 bg-white/80 shadow-sm backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-95 ${
              isChatOpen
                ? "pointer-events-none scale-50 -rotate-90 opacity-0"
                : "scale-100 rotate-0 opacity-100"
            }`}
          >
            <AvatarFallback className="bg-transparent text-xs font-extrabold tracking-tight text-primary">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={handleCloseChat}
            className={`absolute inset-0 flex items-center justify-center text-primary transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-110 active:scale-90 ${
              isChatOpen
                ? "scale-100 rotate-0 opacity-100"
                : "pointer-events-none scale-50 rotate-90 opacity-0"
            }`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Center: Ask Pill <-> JomKira Title */}
        <div className="relative flex flex-1 justify-center px-4">
          <button
            onClick={handleAskAIClick}
            className={`flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-5 py-2 shadow-[0_4px_12px_rgba(0,85,255,0.08)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98] ${
              isChatOpen
                ? "pointer-events-none translate-y-2 scale-90 opacity-0"
                : "translate-y-0 scale-100 opacity-100"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-sm font-bold tracking-tight text-primary">
              Ask JomKira AI
            </span>
          </button>
          <div
            className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              isChatOpen
                ? "translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-2 scale-90 opacity-0"
            }`}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-bold tracking-tight text-primary">
              JomKira AI
            </span>
            <Badge
              variant="outline"
              className="border-primary/20 px-1.5 py-0 text-[10px] text-primary/70"
            >
              beta
            </Badge>
          </div>
        </div>

        {/* Right: Bell <-> New Chat Plus */}
        <div className="relative h-9 w-9">
          <button
            onClick={handleNotificationClick}
            className={`absolute inset-0 flex items-center justify-center rounded-full border border-white/40 bg-white/80 shadow-sm backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-95 ${
              isChatOpen
                ? "pointer-events-none scale-50 rotate-90 opacity-0"
                : "scale-100 rotate-0 opacity-100"
            }`}
          >
            <Bell className="h-5 w-5 text-primary" />
            {hasNotification && (
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500 shadow-sm" />
            )}
          </button>
          <button
            onClick={handleNewChat}
            className={`absolute inset-0 flex items-center justify-center text-primary transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-110 active:scale-90 ${
              isChatOpen
                ? "scale-100 rotate-0 opacity-100"
                : "pointer-events-none scale-50 -rotate-90 opacity-0"
            }`}
          >
            <MessageSquarePlus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 3. Chat Content Area (Smooth Expansion) */}
      <div
        className={`flex flex-col transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isChatOpen
            ? "flex-1 opacity-100"
            : "pointer-events-none h-0 overflow-hidden opacity-0"
        }`}
        style={isChatOpen ? { height: "calc(100dvh - 120px)" } : undefined}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div
            className={`flex flex-1 flex-col overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              isChatOpen ? "translate-y-0" : "translate-y-4"
            }`}
          >
            {children}
          </div>
          <p className="flex shrink-0 items-center justify-center gap-1 py-4 text-center text-xs text-primary/40">
            🇲🇾 100% Malaysian made
          </p>
        </div>
      </div>
    </div>
  );
}
