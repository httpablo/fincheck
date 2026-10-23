import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { httpClient } from "./httpClient";
import { localStorageKeys } from "../config/localStorageKeys";

describe("httpClient interceptor", () => {
  const originalAdapter = httpClient.defaults.adapter;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    httpClient.defaults.adapter = originalAdapter;
  });

  it("dispatches 'fincheck:unauthorized' event on 401 error outside /auth routes", async () => {
    const listener = vi.fn();
    window.addEventListener("fincheck:unauthorized", listener);

    httpClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      const error = new AxiosError(
        "Unauthorized",
        "ERR_BAD_REQUEST",
        config,
        null,
        {
          status: 401,
          statusText: "Unauthorized",
          headers: {},
          config,
          data: { message: "Unauthorized" },
        }
      );
      return Promise.reject(error);
    };

    await expect(httpClient.get("/users/me")).rejects.toBeInstanceOf(AxiosError);

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener("fincheck:unauthorized", listener);
  });

  it("does not dispatch 'fincheck:unauthorized' event on 401 error for /auth/signin route", async () => {
    const listener = vi.fn();
    window.addEventListener("fincheck:unauthorized", listener);

    httpClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      const error = new AxiosError(
        "Unauthorized",
        "ERR_BAD_REQUEST",
        config,
        null,
        {
          status: 401,
          statusText: "Unauthorized",
          headers: {},
          config,
          data: { message: "Invalid credentials" },
        }
      );
      return Promise.reject(error);
    };

    await expect(
      httpClient.post("/auth/signin", { email: "test@test.com", password: "123" })
    ).rejects.toBeInstanceOf(AxiosError);

    expect(listener).not.toHaveBeenCalled();
    window.removeEventListener("fincheck:unauthorized", listener);
  });

  it("does not dispatch 'fincheck:unauthorized' event on 401 error for /auth/signup route", async () => {
    const listener = vi.fn();
    window.addEventListener("fincheck:unauthorized", listener);

    httpClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      const error = new AxiosError(
        "Unauthorized",
        "ERR_BAD_REQUEST",
        config,
        null,
        {
          status: 401,
          statusText: "Unauthorized",
          headers: {},
          config,
          data: { message: "Email already in use" },
        }
      );
      return Promise.reject(error);
    };

    await expect(
      httpClient.post("/auth/signup", { name: "Test", email: "test@test.com", password: "123" })
    ).rejects.toBeInstanceOf(AxiosError);

    expect(listener).not.toHaveBeenCalled();
    window.removeEventListener("fincheck:unauthorized", listener);
  });

  it("does not dispatch 'fincheck:unauthorized' event on 500 error", async () => {
    const listener = vi.fn();
    window.addEventListener("fincheck:unauthorized", listener);

    httpClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      const error = new AxiosError(
        "Internal Server Error",
        "ERR_BAD_RESPONSE",
        config,
        null,
        {
          status: 500,
          statusText: "Internal Server Error",
          headers: {},
          config,
          data: { message: "Internal server error" },
        }
      );
      return Promise.reject(error);
    };

    await expect(httpClient.get("/users/me")).rejects.toBeInstanceOf(AxiosError);

    expect(listener).not.toHaveBeenCalled();
    window.removeEventListener("fincheck:unauthorized", listener);
  });

  it("attaches Authorization header when accessToken exists in localStorage", async () => {
    localStorage.setItem(localStorageKeys.ACCESS_TOKEN, "fake-jwt-token");

    let capturedConfig: InternalAxiosRequestConfig | undefined;
    httpClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      capturedConfig = config;
      return {
        data: { success: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    const response = await httpClient.get("/users/me");
    expect(response.status).toBe(200);
    expect(capturedConfig).toBeDefined();
    expect(capturedConfig!.headers.Authorization).toBe("Bearer fake-jwt-token");
  });

  it("does not attach Authorization header when accessToken is absent from localStorage", async () => {
    let capturedConfig: InternalAxiosRequestConfig | undefined;
    httpClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      capturedConfig = config;
      return {
        data: { success: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    const response = await httpClient.get("/users/me");
    expect(response.status).toBe(200);
    expect(capturedConfig).toBeDefined();
    expect(capturedConfig!.headers.Authorization).toBeUndefined();
  });
});
