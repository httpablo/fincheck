import React from "react";
import { AuthContext } from "./AuthContext";
import { useCallback } from "react";
import { localStorageKeys } from "../config/localStorageKeys";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = React.useState<boolean>(() => {
    const storeAccessToken = localStorage.getItem(
      localStorageKeys.ACCESS_TOKEN
    );

    return !!storeAccessToken;
  });

  const signin = useCallback((accessToken: string) => {
    localStorage.setItem(localStorageKeys.ACCESS_TOKEN, accessToken);
    setSignedIn(true);
  }, []);

  return (
    <AuthContext.Provider value={{ signedIn, signin }}>
      {children}
    </AuthContext.Provider>
  );
}
