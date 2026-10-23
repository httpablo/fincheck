import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { transactionsService } from "../services/transactionsService";
import type { TransactionsFilters } from "../services/transactionsService/getAll";

export function useTransactions(filters: TransactionsFilters) {
  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => transactionsService.getAll(filters),
    placeholderData: keepPreviousData,
  });

  return {
    transactions: data ?? [],
    isLoading: isFetching,
    isInitialLoading: isLoading,
    refetchTransactions: refetch,
  };
}
