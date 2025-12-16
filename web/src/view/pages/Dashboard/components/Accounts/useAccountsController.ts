import { useState } from "react";

export function useAccountsController() {
  const [slideState, setSlideState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  return { slideState, setSlideState };
}
