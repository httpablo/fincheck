import { httpClient } from "../httpClient";

interface ProfileResponse {
  name: string;
  email: string;
}

export async function profile() {
  const { data } = await httpClient.get<ProfileResponse>("/users/profile");

  return data;
}
