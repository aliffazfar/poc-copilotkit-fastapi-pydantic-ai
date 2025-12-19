"use client";

import {
  type InputProps,
  type UserMessageProps,
  type AssistantMessageProps,
  Markdown,
} from "@copilotkit/react-ui";
import { UserMessage as UserMessageType } from "@copilotkit/react-core/v2";
import {
  Sparkles,
  Plus,
  ImageIcon,
  AtSign,
  ArrowUp,
  Wallet,
} from "lucide-react";

/**
 * Helper function to extract text content from a UserMessage
 */
function extractTextContent(content: UserMessageType["content"]): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter(
        (item): item is { type: "text"; text: string } => item.type === "text"
      )
      .map((item) => item.text)
      .join("");
  }
  return "";
}

/**
 * Custom User Message component (Light Aurora Theme)
 */
export function JomKiraUserMessage({ message }: UserMessageProps) {
  const textContent = message ? extractTextContent(message.content) : "";

  return (
    <div className="mb-4 flex justify-end">
      <div className="bg-jomkira-blue-button max-w-[85%] rounded-[15px] rounded-br-sm px-3.5 py-2.5 text-white shadow-lg shadow-blue-500/10">
        <p className="text-[15px] leading-relaxed font-medium">{textContent}</p>
      </div>
    </div>
  );
}

/**
 * Custom Assistant Message component (Light Aurora Theme)
 */
export function JomKiraAssistantMessage({
  message,
  isLoading,
  subComponent,
}: AssistantMessageProps) {
  const hasContent = message?.content && message.content.trim().length > 0;

  // Do not render anything if there is no content, not loading, and no subComponent
  if (!hasContent && !isLoading && !subComponent) {
    return null;
  }

  return (
    <div className="mb-4">
      {/* Only render the bubble if there is content or loading */}
      {(hasContent || isLoading) && (
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-[15px] rounded-bl-sm border border-white/60 bg-white/40 px-3.5 py-2.5 shadow-sm backdrop-blur-md">
            {hasContent && (
              <div className="leading-relaxed font-medium text-black [&_*]:!text-[15px] [&_*]:!leading-relaxed">
                <Markdown content={message.content || ""} />
              </div>
            )}
            {isLoading && (
              <div className="flex gap-1.5 py-1">
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-[#0055FF]/40"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-[#0055FF]/40"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-[#0055FF]/40"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {subComponent && <div className="mt-4">{subComponent}</div>}
    </div>
  );
}

/**
 * Custom Input component for JomKira chat (Light Aurora Theme)
 */
export function JomKiraInput({ inProgress, onSend }: InputProps) {
  const handleSubmit = (value: string) => {
    if (value.trim() && !inProgress) {
      onSend(value);
    }
  };

  return (
    <div className="shrink-0 px-4 pt-2 pb-2">
      {/* Promo Banner */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/40 p-3.5 shadow-sm backdrop-blur-md">
        <div className="text-jomkira-blue-button flex h-9 w-9 items-center justify-center rounded-full bg-[#0055FF]/10">
          <Wallet className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-bold text-gray-800">
            Snap and pay with JomKira AI, get up to RM 5
          </p>
        </div>
        <span className="text-gray-400">›</span>
      </div>

      {/* Input Area */}
      <div className="relative">
        <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/50 p-3.5 shadow-sm backdrop-blur-md transition-all focus-within:bg-white/70">
          <input
            type="text"
            disabled={inProgress}
            placeholder="Ask JomKira AI"
            className="flex-1 bg-transparent text-[15px] font-medium text-gray-900 placeholder-gray-400 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
          />
        </div>

        {/* Action Icons */}
        <div className="mt-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-5">
            <button
              className="hover:text-jomkira-blue-button text-[#0055FF]/40 transition-colors"
              type="button"
            >
              <Plus className="h-5.5 w-5.5" />
            </button>
            <button
              className="hover:text-jomkira-blue-button text-[#0055FF]/40 transition-colors"
              type="button"
            >
              <ImageIcon className="h-5.5 w-5.5" />
            </button>
            <button
              className="hover:text-jomkira-blue-button text-[#0055FF]/40 transition-colors"
              type="button"
            >
              <AtSign className="h-5.5 w-5.5" />
            </button>
            <button
              className="hover:text-jomkira-blue-button text-[#0055FF]/40 transition-colors"
              type="button"
            >
              <Sparkles className="h-5.5 w-5.5" />
            </button>
          </div>

          <button
            type="button"
            disabled={inProgress}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
              !inProgress
                ? "bg-[#0055FF] text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95"
                : "bg-gray-200 text-gray-400"
            }`}
            onClick={(e) => {
              const container = e.currentTarget.closest(".relative");
              const input = container?.querySelector(
                "input"
              ) as HTMLInputElement;
              if (input) {
                handleSubmit(input.value);
                input.value = "";
              }
            }}
          >
            <ArrowUp className="h-5.5 w-5.5" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
