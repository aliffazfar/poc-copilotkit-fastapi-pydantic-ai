import { ReactNode, ComponentType } from "react";
import { LucideProps } from "lucide-react";

export interface TransferDetails {
  recipient_name: string;
  bank_name: string;
  account_number: string;
  amount: number;
  reference?: string;
}

export interface BillDetails {
  biller_name: string;
  account_number: string;
  amount: number;
  due_date?: string;
  reference_number?: string;
}

export interface BankingState {
  balance: number;
  pending_transfer: TransferDetails | null;
  pending_bill: BillDetails | null;
  transaction_history: string[];
  status:
    | "idle"
    | "confirming_transfer"
    | "confirming_bill"
    | "completed"
    | "error";
}

export interface PromoItem {
  title: string;
  description: string | ReactNode;
  icon: ReactNode;
  bgColor: string;
  textColor: string;
  subTextColor: string;
  actionText?: string;
  id?: string;
}

export interface AccountItem {
  id: string;
  name: string;
  subtitle?: string;
  amount: number;
  badge?: string;
  iconBgColor: string;
  iconColor?: string;
  icon: ComponentType<LucideProps>;
}

export interface ActionButton {
  label: string;
  icon: ComponentType<LucideProps>;
  onClick?: () => void;
  id?: string;
}
