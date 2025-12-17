import { useState } from "react";
import { useWindowWidth } from "../../../../../app/hooks/useWindowWidth";

export function useAccountsController() {
  const windowWidth = useWindowWidth();

  const [slideState, setSlideState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  return { slideState, setSlideState, windowWidth };
}
