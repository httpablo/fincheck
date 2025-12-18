import { useCallback, useState } from "react";
import { DashboardContext } from "./dashboardContext";

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [areValuesVisible, setAreaValuesVisible] = useState(true);

  const toggleValuesVisibility = useCallback(() => {
    setAreaValuesVisible((prev) => !prev);
  }, []);

  return (
    <DashboardContext.Provider
      value={{ areValuesVisible, toggleValuesVisibility }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
