import type { User } from "../../entities/User";
import { httpClient } from "../httpClient";

type ProfileResponse = User;

export async function profile() {
  const { data } = await httpClient.get<ProfileResponse>("/users/profile");

  return data;
}
