"use client";

import { useState, useRef } from "react";
import {
  type InputProps,
  type UserMessageProps,
  type AssistantMessageProps,
  Markdown,
} from "@copilotkit/react-ui";
import { useCopilotChat } from "@copilotkit/react-core";
import { ImageMessage, MessageRole } from "@copilotkit/runtime-client-gql";
import { UserMessage as UserMessageType } from "@copilotkit/react-core/v2";
import {
  Sparkles,
  Plus,
  ImageIcon,
  AtSign,
  ArrowUp,
  Wallet,
  X,
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
  const hasImage = message?.image;

  return (
    <div className="mb-4 flex justify-end">
      <div className="flex max-w-[85%] flex-col items-end gap-2">
        {hasImage && (
          <div className="overflow-hidden rounded-xl border border-white/60 shadow-sm">
            <img
              src={`data:image/${message.image?.format};base64,${message.image?.bytes}`}
              alt="Uploaded content"
              className="h-auto max-h-[200px] max-w-full object-cover"
            />
          </div>
        )}
        {textContent && (
          <div className="bg-jomkira-blue-button rounded-[15px] rounded-br-sm px-3.5 py-2.5 text-white shadow-lg shadow-blue-500/10">
            <p className="text-[15px] leading-relaxed font-medium">
              {textContent}
            </p>
          </div>
        )}
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
  const hasBubble = hasContent || isLoading;

  // Do not render anything if there is no content, not loading, and no subComponent
  if (!hasContent && !isLoading && !subComponent) {
    return null;
  }

  return (
    <div className="mb-4">
      {/* Only render the bubble if there is content or loading */}
      {hasBubble && (
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
      {/* Reduce top margin when there's no bubble above */}
      {subComponent && (
        <div className={hasBubble ? "mt-3" : ""}>{subComponent}</div>
      )}
    </div>
  );
}

/**
 * Custom Input component for JomKira chat (Light Aurora Theme)
 */
export function JomKiraInput({ inProgress, onSend }: InputProps) {
  const { appendMessage } = useCopilotChat();
  const [selectedImage, setSelectedImage] = useState<{
    format: string;
    bytes: string;
    preview: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64 = reader.result.split(",")[1];
          const format = file.type.split("/")[1];
          setSelectedImage({
            format,
            bytes: base64,
            preview: reader.result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    if (e.target) e.target.value = "";
  };

  const handleSubmit = (value: string) => {
    if ((value.trim() || selectedImage) && !inProgress) {
      if (selectedImage) {
        appendMessage(
          new ImageMessage({
            format: selectedImage.format,
            bytes: selectedImage.bytes,
            role: MessageRole.User,
          })
        );
        setSelectedImage(null);
      }
      if (value.trim()) {
        onSend(value);
      }
    }
  };

  return (
    <div className="shrink-0 px-4 pt-2 pb-2">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleImageSelect}
      />
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

        {/* Image Preview */}
        {selectedImage && (
          <div className="relative mt-3 mb-1 inline-block">
            <img
              src={selectedImage.preview}
              alt="Selected"
              className="max-h-32 rounded-xl border border-white/60 shadow-sm"
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

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
              onClick={() => fileInputRef.current?.click()}
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
