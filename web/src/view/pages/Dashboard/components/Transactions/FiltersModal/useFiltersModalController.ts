import { useState } from "react";
import { useBankAccounts } from "../../../../../../app/hooks/useBankAccounts";

interface UseFiltersModalParams {
  open: boolean;
  bankAccountId?: string | undefined;
  year?: number | undefined;
}

export function useFiltersModal({
  open,
  bankAccountId,
  year,
}: UseFiltersModalParams) {
  const [prevOpen, setPrevOpen] = useState(open);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<
    undefined | string
  >(bankAccountId);
  const [selectedYear, setSelectedYear] = useState(
    year ?? new Date().getFullYear(),
  );

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setSelectedBankAccountId(bankAccountId);
      setSelectedYear(year ?? new Date().getFullYear());
    }
  }

  const { accounts } = useBankAccounts();

  function handleSelectBankAccount(bankAccountId: string) {
    setSelectedBankAccountId((prevState) =>
      prevState === bankAccountId ? undefined : bankAccountId
    );
  }

  function handleChangeYear(step: number) {
    setSelectedYear((prevState) => prevState + step);
  }

  return {
    handleSelectBankAccount,
    selectedBankAccountId,
    handleChangeYear,
    selectedYear,
    accounts,
  };
}
