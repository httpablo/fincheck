import { bankAccountsService } from "./../../../../../app/services/bankAccountsService/index";
import { useMemo, useState } from "react";
import { useWindowWidth } from "../../../../../app/hooks/useWindowWidth";
import { useDashboard } from "../DashboardContext/useDashboard";
import { useQuery } from "@tanstack/react-query";

export function useAccountsController() {
  const windowWidth = useWindowWidth();
  const { areValuesVisible, toggleValuesVisibility, openNewAccountModal } =
    useDashboard();

  const [slideState, setSlideState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  const { data, isFetching } = useQuery({
    queryKey: ["bankAccounts"],
    queryFn: bankAccountsService.getAll,
  });

  const currentyBalance = useMemo(() => {
    if (!data) return 0;

    return data.reduce((acc, account) => acc + account.currentBalance, 0);
  }, [data]);

  return {
    slideState,
    setSlideState,
    windowWidth,
    areValuesVisible,
    toggleValuesVisibility,
    isLoading: isFetching,
    accounts: data ?? [],
    openNewAccountModal,
    currentyBalance,
  };
}
