import { useMemo, useState } from "react";
import { useWindowWidth } from "../../../../../app/hooks/useWindowWidth";
import { useDashboard } from "../DashboardContext/useDashboard";
import { useBankAccounts } from "../../../../../app/hooks/useBankAccounts";
import { sumMoney } from "../../../../../app/utils/sumMoney";

export function useAccountsController() {
  const windowWidth = useWindowWidth();
  const {
    areValuesVisible,
    toggleValuesVisibility,
    openNewAccountModal,
    monthSummary,
    allTransactions,
    filters,
  } = useDashboard();

  const [slideState, setSlideState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  const { accounts, isFetching } = useBankAccounts();

  const currentBalance = useMemo(() => {
    return sumMoney(accounts.map((account) => account.currentBalance));
  }, [accounts]);

  return {
    slideState,
    setSlideState,
    windowWidth,
    areValuesVisible,
    toggleValuesVisibility,
    isLoading: isFetching,
    accounts,
    openNewAccountModal,
    currentBalance,
    monthSummary,
    allTransactions,
    filters,
  };
}
