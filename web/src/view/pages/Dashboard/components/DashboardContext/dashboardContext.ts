import { createContext } from "react";

export interface DashboardContextValue {
  areValuesVisible: boolean;
  toggleValuesVisibility(): void;
}

export const DashboardContext = createContext({} as DashboardContextValue);
