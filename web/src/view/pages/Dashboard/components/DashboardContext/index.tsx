import { useCallback, useMemo, useState } from "react";
import { DashboardContext } from "./dashboardContext";
import type { BankAccount } from "../../../../../app/entities/BankAccount";
import type { TransactionsFilters } from "../../../../../app/services/transactionsService/getAll";
import { useTransactions } from "../../../../../app/hooks/useTransactions";

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [areValuesVisible, setAreValuesVisible] = useState(true);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] =
    useState(false);
  const [newTransactionType, setNewTransactionType] = useState<
    "INCOME" | "EXPENSE" | null
  >(null);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<null | BankAccount>(null);

  const [filters, setFilters] = useState<TransactionsFilters>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const {
    transactions: allTransactions,
    isLoading,
    isInitialLoading,
  } = useTransactions({
    month: filters.month,
    year: filters.year,
    bankAccountId: filters.bankAccountId,
  });

  const monthSummary = useMemo(() => {
    let incomes = 0;
    let expenses = 0;

    for (const transaction of allTransactions) {
      if (transaction.type === "INCOME") {
        incomes += transaction.value;
      } else if (transaction.type === "EXPENSE") {
        expenses += transaction.value;
      }
    }

    return {
      incomes,
      expenses,
      balance: incomes - expenses,
    };
  }, [allTransactions]);

  const handleChangeFilters = useCallback(
    <TFilter extends keyof TransactionsFilters>(filter: TFilter) => {
      return (value: TransactionsFilters[typeof filter]) => {
        setFilters((prev) => {
          if (prev[filter] === value) return prev;
          return { ...prev, [filter]: value };
        });
      };
    },
    [],
  );

  const handleApplyFilters = useCallback(
    ({
      bankAccountId,
      year,
    }: {
      bankAccountId: string | undefined;
      year: number;
    }) => {
      setFilters((prev) => ({
        ...prev,
        bankAccountId,
        year,
      }));
    },
    [],
  );

  const toggleValuesVisibility = useCallback(() => {
    setAreValuesVisible((prev) => !prev);
  }, []);

  const openNewAccountModal = useCallback(() => {
    setIsNewAccountModalOpen(true);
  }, []);

  const closeNewAccountModal = useCallback(() => {
    setIsNewAccountModalOpen(false);
  }, []);

  const openNewTransactionModal = useCallback((type: "INCOME" | "EXPENSE") => {
    setIsNewTransactionModalOpen(true);
    setNewTransactionType(type);
  }, []);

  const closeNewTransactionModal = useCallback(() => {
    setNewTransactionType(null);
    setIsNewTransactionModalOpen(false);
  }, []);

  const openEditAccountModal = useCallback((bankAccount: BankAccount) => {
    setAccountToEdit(bankAccount);
    setIsEditAccountModalOpen(true);
  }, []);

  const closeEditAccountModal = useCallback(() => {
    setAccountToEdit(null);
    setIsEditAccountModalOpen(false);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        areValuesVisible,
        toggleValuesVisibility,
        isNewAccountModalOpen,
        openNewAccountModal,
        closeNewAccountModal,
        isNewTransactionModalOpen,
        openNewTransactionModal,
        closeNewTransactionModal,
        newTransactionType,
        isEditAccountModalOpen,
        openEditAccountModal,
        closeEditAccountModal,
        accountToEdit,
        filters,
        handleChangeFilters,
        handleApplyFilters,
        allTransactions,
        isLoading,
        isInitialLoading,
        monthSummary,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
