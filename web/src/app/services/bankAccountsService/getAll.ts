import type { BankAccount } from "../../entities/BankAccount";
import { httpClient } from "../httpCliente";

type BankAccountResponse = Array<BankAccount>;

export async function getAll() {
  const { data } = await httpClient.get<BankAccountResponse>("/bank-accounts");

  return data;
}
