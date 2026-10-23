import axios from "axios";
import { localStorageKeys } from "../config/localStorageKeys";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
});

httpClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(localStorageKeys.ACCESS_TOKEN);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url || "";
      const isAuthRoute =
        requestUrl.includes("/auth/signin") ||
        requestUrl.includes("/auth/signup");

      if (!isAuthRoute) {
        window.dispatchEvent(new Event("fincheck:unauthorized"));
      }
    }

    return Promise.reject(error);
  }
);
