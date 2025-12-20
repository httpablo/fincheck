import { httpClient } from "../httpClient";

export interface SigninParams {
  password: string;
  email: string;
}

interface SigninResponse {
  accessToken: string;
}

export async function signin(params: SigninParams) {
  const { data } = await httpClient.post<SigninResponse>(
    "/auth/signin",
    params
  );

  return data;
}
