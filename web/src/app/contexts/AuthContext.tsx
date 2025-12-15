import React from "react";
import { AuthContext } from "./AuthContext";
import { useCallback } from "react";
import { localStorageKeys } from "../config/localStorageKeys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/usersService";
import toast from "react-hot-toast";
import { LaunchScreen } from "../../view/components/LaunchScreen";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const [signedIn, setSignedIn] = React.useState<boolean>(() => {
    const storeAccessToken = localStorage.getItem(
      localStorageKeys.ACCESS_TOKEN
    );

    return !!storeAccessToken;
  });

  const { isFetching, isSuccess } = useQuery({
    queryKey: ["users", "profile"],
    queryFn: async () => {
      try {
        return await userService.profile();
      } catch {
        signout();
        toast.error("Sua sessão expirou. Faça login novamente.");
        throw new Error("Unauthorized");
      }
    },
    enabled: signedIn,
    staleTime: Infinity,
  });

  const signin = useCallback((accessToken: string) => {
    localStorage.setItem(localStorageKeys.ACCESS_TOKEN, accessToken);

    setSignedIn(true);
  }, []);

  const signout = useCallback(() => {
    localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
    queryClient.removeQueries({ queryKey: ["users", "profile"] });

    setSignedIn(false);
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{ signedIn: isSuccess && signedIn, signin, signout }}
    >
      <LaunchScreen isLoading={isFetching} />

      {!isFetching && children}
    </AuthContext.Provider>
  );
}
