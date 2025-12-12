import { createContext } from "react";

interface AuthContextValue {
  signedIn: boolean;
  signin(accessToken: string): void;
}

export const AuthContext = createContext({} as AuthContextValue);
