import { useState } from "react";
import { useWindowWidth } from "../../../../../app/hooks/useWindowWidth";
import { useDashboard } from "../DashboardContext/useDashboard";

export function useAccountsController() {
  const windowWidth = useWindowWidth();
  const { areValuesVisible, toggleValuesVisibility } = useDashboard();

  const [slideState, setSlideState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  return {
    slideState,
    setSlideState,
    windowWidth,
    areValuesVisible,
    toggleValuesVisibility,
    isLoading: false,
    accounts: [],
  };
}
