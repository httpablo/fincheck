import { createContext } from "react";
import type { BankAccount } from "../../../../../app/entities/BankAccount";
import type { Transaction } from "../../../../../app/entities/Transaction";
import type { TransactionsFilters } from "../../../../../app/services/transactionsService/getAll";

export interface MonthSummary {
  incomes: number;
  expenses: number;
  balance: number;
}

export interface DashboardContextValue {
  areValuesVisible: boolean;
  isNewAccountModalOpen: boolean;
  isNewTransactionModalOpen: boolean;
  newTransactionType: "INCOME" | "EXPENSE" | null;
  toggleValuesVisibility(): void;
  openNewAccountModal(): void;
  closeNewAccountModal(): void;
  openNewTransactionModal(type: "INCOME" | "EXPENSE"): void;
  closeNewTransactionModal(): void;
  isEditAccountModalOpen: boolean;
  accountToEdit: null | BankAccount;
  openEditAccountModal(bankAccount: BankAccount): void;
  closeEditAccountModal(): void;
  filters: TransactionsFilters;
  handleChangeFilters<TFilter extends keyof TransactionsFilters>(
    filter: TFilter
  ): (value: TransactionsFilters[typeof filter]) => void;
  handleApplyFilters(filters: {
    bankAccountId: string | undefined;
    year: number;
  }): void;
  allTransactions: Transaction[];
  isLoading: boolean;
  isInitialLoading: boolean;
  monthSummary: MonthSummary;
}

export const DashboardContext = createContext({} as DashboardContextValue);
