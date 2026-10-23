import { useMemo, useState } from "react";
import { useDashboard } from "../DashboardContext/useDashboard";
import type { Transaction } from "../../../../../app/entities/Transaction";

export function useTransactionsController() {
  const {
    areValuesVisible,
    openNewTransactionModal,
    filters,
    handleChangeFilters,
    handleApplyFilters: applyFilters,
    allTransactions,
    isLoading,
    isInitialLoading,
  } = useDashboard();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactionBeingEdited, setTransactionBeingEdited] =
    useState<null | Transaction>(null);

  const transactions = useMemo(() => {
    if (!filters.type) return allTransactions;
    return allTransactions.filter((t) => t.type === filters.type);
  }, [allTransactions, filters.type]);

  function handleApplyFilters({
    bankAccountId,
    year,
  }: {
    bankAccountId: string | undefined;
    year: number;
  }) {
    applyFilters({ bankAccountId, year });
    setIsFilterModalOpen(false);
  }

  function handleOpenFilterModal() {
    setIsFilterModalOpen(true);
  }

  function handleCloseFilterModal() {
    setIsFilterModalOpen(false);
  }

  function handleOpenEditModal(transaction: Transaction) {
    setIsEditModalOpen(true);
    setTransactionBeingEdited(transaction);
  }

  function handleCloseEditModal() {
    setIsEditModalOpen(false);
    setTransactionBeingEdited(null);
  }

  return {
    areValuesVisible,
    openNewTransactionModal,
    isInitialLoading,
    isLoading,
    handleOpenFilterModal,
    handleCloseFilterModal,
    isFilterModalOpen,
    transactions,
    filters,
    handleChangeFilters,
    handleApplyFilters,
    isEditModalOpen,
    transactionBeingEdited,
    handleOpenEditModal,
    handleCloseEditModal,
  };
}
