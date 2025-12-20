"use client";

import { useState } from "react";
import {
  useCoAgent,
  useCopilotReadable,
  useCopilotAction,
  useCopilotChat,
} from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { TextMessage, MessageRole } from "@copilotkit/runtime-client-gql";
import { ActionButton, BankingState, PromoItem } from "@/lib/types";
import { InChatPaymentCard } from "@/components/banking/in-chat-payment-card";
import {
  JomKiraUserMessage,
  JomKiraAssistantMessage,
  JomKiraInput,
} from "@/components/jomkira/chat-overlay";
import {
  PromoCard,
  PromoCardsContainer,
} from "@/components/jomkira/promo-cards";
import { DashboardHeader } from "@/components/jomkira/dashboard-header";
import { BalanceCard } from "@/components/jomkira/balance-card";
import { LinkAccountCard } from "@/components/jomkira/link-account-card";
import { logger } from "@/lib/logger";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  PiggyBank,
  Plus,
  Scan,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { AccountsSection } from "@/components/jomkira/accounts-section";
import { AccountItem } from "@/lib/types";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { state } = useCoAgent<BankingState>({
    name: "jom_kira_agent",
    initialState: {
      balance: 50.43,
      pending_transfer: null,
      pending_bill: null,
      transaction_history: [],
      status: "idle",
    },
  });
  const { appendMessage } = useCopilotChat();

  useCopilotReadable({
    description:
      "The user's current banking state including balance, pending transfers, and transaction history",
    value: state,
  });

  // Render-only action for fund transfers
  useCopilotAction({
    name: "prepare_transfer",
    available: "disabled", // Render-only - the tool is defined on the backend
    render: ({ args, status }) => {
      const { recipient_name, bank_name, account_number, amount, reference } =
        args as {
          recipient_name?: string;
          bank_name?: string;
          account_number?: string;
          amount?: number;
          reference?: string;
        };

      if (status !== "complete") {
        return (
          <div className="p-2 text-sm text-gray-500 italic">
            Preparing transfer details...
          </div>
        );
      }

      return (
        <InChatPaymentCard
          type="transfer"
          recipientName={recipient_name || ""}
          bankName={bank_name || ""}
          accountNumber={account_number || ""}
          amount={amount || 0}
          reference={reference}
          onApprove={() => {
            logger.info(
              {
                amount,
                bank_name,
                has_reference: !!reference,
              },
              "Transfer confirmed by user"
            );
            appendMessage(
              new TextMessage({
                role: MessageRole.User,
                content: "Yes, proceed with the transfer.",
              })
            );
          }}
          onDecline={() => {
            logger.info(
              {
                amount,
                bank_name,
                has_reference: !!reference,
              },
              "Transfer declined by user"
            );
            appendMessage(
              new TextMessage({
                role: MessageRole.User,
                content: "No, cancel the transfer.",
              })
            );
          }}
          onEdit={() => {
            appendMessage(
              new TextMessage({
                role: MessageRole.User,
                content: "I need to edit the transfer details.",
              })
            );
          }}
        />
      );
    },
  });

  // Render-only action for bill payments
  useCopilotAction({
    name: "prepare_bill_payment",
    available: "disabled", // Render-only - the tool is defined on the backend
    render: ({ args, status }) => {
      const {
        biller_name,
        account_number,
        amount,
        due_date,
        reference_number,
      } = args as {
        biller_name?: string;
        account_number?: string;
        amount?: number;
        due_date?: string;
        reference_number?: string;
      };

      if (status !== "complete") {
        return (
          <div className="p-2 text-sm text-gray-500 italic">
            Preparing bill payment details...
          </div>
        );
      }

      return (
        <InChatPaymentCard
          type="bill"
          billerName={biller_name || ""}
          billerAccountNumber={account_number || ""}
          amount={amount || 0}
          dueDate={due_date}
          reference={reference_number}
          onApprove={() => {
            logger.info(
              {
                amount,
                biller_name,
                has_due_date: !!due_date,
              },
              "Bill payment confirmed by user"
            );
            appendMessage(
              new TextMessage({
                role: MessageRole.User,
                content: "Yes, proceed with the bill payment.",
              })
            );
          }}
          onDecline={() => {
            logger.info(
              {
                amount,
                biller_name,
                has_due_date: !!due_date,
              },
              "Bill payment declined by user"
            );
            appendMessage(
              new TextMessage({
                role: MessageRole.User,
                content: "No, cancel the bill payment.",
              })
            );
          }}
          onEdit={() => {
            appendMessage(
              new TextMessage({
                role: MessageRole.User,
                content: "I need to edit the bill payment details.",
              })
            );
          }}
        />
      );
    },
  });

  const handleOpenChat = () => {
    logger.info("Chat opened via main action");
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    logger.info("Chat closed");
    setIsChatOpen(false);
  };

  const handlePromoClick = (title: string, id?: string) => {
    logger.info({ title, id }, "Promo card clicked in dashboard");
    if (id === "jomkira-ai") {
      handleOpenChat();
    }
  };

  const DASHBOARD_ACTIONS: ActionButton[] = [
    { label: "Scan", icon: Scan, id: "scan" },
    { label: "Add money", icon: Plus, id: "add_money" },
    { label: "Receive", icon: ArrowDownLeft, id: "receive" },
    { label: "Transfer", icon: ArrowUpRight, id: "transfer" },
  ];

  const MOCK_ACCOUNTS: AccountItem[] = [
    {
      id: "main",
      name: "Main Account",
      amount: 50.43,
      badge: "3.00% p.a.",
      iconBgColor: "bg-blue-600",
      icon: Wallet,
    },
    {
      id: "pocket",
      name: "Jom Pocket",
      subtitle: "Save Pocket",
      amount: 0.0,
      badge: "3.00% p.a.",
      iconBgColor: "bg-teal-400",
      icon: PiggyBank,
    },
  ];

  const PROMO_DATA: PromoItem[] = [
    {
      title: "JomKira PayLater",
      description: (
        <>
          Get credit limit up to
          <br />
          RM 1,499
        </>
      ),
      icon: <span className="text-lg font-bold">J</span>,
      bgColor: "#D1F5FA",
      textColor: "#006064",
      subTextColor: "#00838F",
      actionText: "Apply now",
    },
    {
      title: "JomKira AI",
      description: "Get RM 5 cashback!",
      icon: <Sparkles className="h-5 w-5" />,
      bgColor: "#F3E5F5",
      textColor: "#7B1FA2",
      subTextColor: "#AB47BC",
      actionText: "Learn more",
      id: "jomkira-ai", // Added ID for easier identification
    },
    {
      title: "Smart Savings",
      description: "Earn 4.2% p.a. interest today",
      icon: <TrendingUp className="h-5 w-5" />,
      bgColor: "#E8F5E9",
      textColor: "#2E7D32",
      subTextColor: "#388E3C",
      actionText: "Save now",
    },
    {
      title: "Card Security",
      description: "New: Instant card lock feature",
      icon: <ShieldCheck className="h-5 w-5" />,
      bgColor: "#FFF3E0",
      textColor: "#E65100",
      subTextColor: "#EF6C00",
      actionText: "Secure now",
    },
    {
      title: "Fixed Deposit",
      description: "Higher returns for your wealth",
      icon: <Landmark className="h-5 w-5" />,
      bgColor: "#E8EAF6",
      textColor: "#1A237E",
      subTextColor: "#283593",
      actionText: "Invest now",
    },
  ];

  return (
    <div
      className={`bg-background relative min-h-screen font-sans transition-all duration-500 ${
        isChatOpen ? "h-screen overflow-hidden" : "overflow-x-hidden"
      }`}
    >
      {/* Global Background Gradient (Fixed, covers entire screen) */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 h-[60vh] w-full"
        style={{
          background:
            "radial-gradient(100% 100% at 50% 0%, #E0F2FE 0%, #F3E8FF 40%, #F2F5F9 100%)",
          opacity: 1,
        }}
      />

      {/* Unified Header & Chat Container */}
      <DashboardHeader
        isChatOpen={isChatOpen}
        onAskAIClick={handleOpenChat}
        onCloseChat={handleCloseChat}
      >
        <CopilotChat
          labels={{
            title: "JomKira AI",
            initial: "How can I help you?",
            placeholder: "Ask JomKira AI",
          }}
          UserMessage={JomKiraUserMessage}
          AssistantMessage={JomKiraAssistantMessage}
          Input={JomKiraInput}
          className="h-full"
          imageUploadsEnabled
        />
      </DashboardHeader>

      {/* Main Dashboard Content - Hide when chat is open */}
      <div
        className={`relative z-0 mx-auto flex flex-col transition-all duration-500 ${
          isChatOpen ? "hidden" : "flex"
        }`}
      >
        <main className="bg-background relative z-10 -mt-4 flex-1 space-y-4 rounded-t-[15px] pt-2 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
          {/* Balance Card */}
          <div className="px-2">
            <BalanceCard
              balance={state?.balance ?? 50.43}
              actions={DASHBOARD_ACTIONS}
            />
          </div>

          {/* Promo Cards - Full width but contained */}
          <div className="pl-3">
            <PromoCardsContainer>
              {PROMO_DATA.map((card, idx) => (
                <PromoCard
                  key={idx}
                  {...card}
                  onClick={() => handlePromoClick(card.title, card.id)}
                />
              ))}
            </PromoCardsContainer>
          </div>

          {/* DuitNow Link Section */}
          <div className="-mt-4 px-2">
            <LinkAccountCard />
          </div>

          {/* Accounts Section */}
          <AccountsSection
            title="Accounts"
            accounts={MOCK_ACCOUNTS}
            onAccountClick={(account) =>
              logger.info({ accountId: account.id }, "Account clicked")
            }
          />
        </main>
      </div>
    </div>
  );
}
