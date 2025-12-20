import { httpClient } from "../httpCliente";

export async function remove(bankAccount: string) {
  const { data } = await httpClient.delete(`/bank-accounts/${bankAccount}`);

  return data;
}
