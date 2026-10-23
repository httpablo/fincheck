import React, { useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { localStorageKeys } from "../config/localStorageKeys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../services/usersService";
import toast from "react-hot-toast";
import { LaunchScreen } from "../../view/components/LaunchScreen";
import axios from "axios";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const [signedIn, setSignedIn] = React.useState<boolean>(() => {
    const storeAccessToken = localStorage.getItem(
      localStorageKeys.ACCESS_TOKEN,
    );

    return !!storeAccessToken;
  });

  const signout = useCallback(() => {
    localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
    queryClient.clear();

    setSignedIn(false);
  }, [queryClient]);

  useEffect(() => {
    function handleUnauthorized() {
      signout();
      toast.error("Sua sessão expirou. Faça login novamente.", {
        id: "session-expired",
      });
    }

    window.addEventListener("fincheck:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("fincheck:unauthorized", handleUnauthorized);
    };
  }, [signout]);

  const { isFetching, isSuccess, data } = useQuery({
    queryKey: ["users", "profile"],
    queryFn: async () => {
      try {
        return await usersService.profile();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          signout();
          toast.error("Sua sessão expirou. Faça login novamente.", {
            id: "session-expired",
          });
        }
        throw error;
      }
    },
    enabled: signedIn,
    staleTime: Infinity,
  });

  const signin = useCallback((accessToken: string) => {
    localStorage.setItem(localStorageKeys.ACCESS_TOKEN, accessToken);

    setSignedIn(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{ signedIn: isSuccess && signedIn, user: data, signin, signout }}
    >
      <LaunchScreen isLoading={isFetching} />

      {!isFetching && children}
    </AuthContext.Provider>
  );
}
