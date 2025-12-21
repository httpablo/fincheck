import { useEffect, useState } from "react";
import { useDashboard } from "../DashboardContext/useDashboard";
import { useTransactions } from "../../../../../app/hooks/useTransactions";
import type { TransactionsFilters } from "../../../../../app/services/transactionsService/getAll";

export function useTransactionsController() {
  const { areValuesVisible } = useDashboard();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionsFilters>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const { transactions, isLoading, isInitialLoading, refetchTransactions } =
    useTransactions(filters);

  useEffect(() => {
    refetchTransactions();
  }, [filters, refetchTransactions]);

  function handleChangeMonth(monthIndex: number) {
    setFilters((prevSatate) => ({
      ...prevSatate,
      month: monthIndex,
    }));
  }

  function handleOpenFilterModal() {
    setIsFilterModalOpen(true);
  }

  function handleCloseFilterModal() {
    setIsFilterModalOpen(false);
  }

  return {
    areValuesVisible,
    isInitialLoading,
    isLoading,
    handleOpenFilterModal,
    handleCloseFilterModal,
    isFilterModalOpen,
    transactions,
    handleChangeMonth,
    filters,
  };
}
