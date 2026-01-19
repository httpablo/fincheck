import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useBankAccounts } from "../../../../../app/hooks/useBankAccounts";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";
import type { Transaction } from "../../../../../app/entities/Transaction";
import { useCategories } from "../../../../../app/hooks/useCategories";
import { transactionService } from "../../../../../app/services/transactionsService";

const schema = z.object({
  value: z.union([z.string().nonempty("Informe o valor"), z.number()]),
  name: z.string().nonempty("Informe o nome"),
  categoryId: z.string().nonempty("Informe a categoria"),
  bankAccountId: z.string().nonempty("Informe a conta bancária"),
  date: z.date(),
});

type FormData = z.infer<typeof schema>;

export function useEditTransactionModalController(
  transaction: Transaction | null,
  onClose: () => void,
) {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankAccountId: transaction?.bankAccountId,
      categoryId: transaction?.categoryId,
      name: transaction?.name,
      value: transaction?.value,
      date: transaction ? new Date(transaction?.date) : new Date(),
    },
  });

  useEffect(() => {
    if (transaction) {
      reset({
        bankAccountId: transaction.bankAccountId,
        categoryId: transaction.categoryId,
        name: transaction.name,
        value: transaction.value,
        date: new Date(transaction.date),
      });
    }
  }, [transaction, reset]);

  const queryClient = useQueryClient();

  const { accounts } = useBankAccounts();
  const { categories: categoriesList } = useCategories();

  const { status, mutateAsync: updateTransaction } = useMutation({
    mutationFn: transactionService.update,
  });

  const { status: statusDelete, mutateAsync: removeTransaction } = useMutation({
    mutationFn: transactionService.remove,
  });

  const isLoading = status === "pending";
  const isLoadingDelete = statusDelete === "pending";

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await updateTransaction({
        ...data,
        id: transaction!.id,
        value: currencyStringToNumber(data.value),
        type: transaction!.type,
        date: data.date.toISOString(),
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });
      onClose();
      toast.success(
        transaction?.type === "EXPENSE"
          ? "Despesa editada com sucesso!"
          : "Receita editada com sucesso!",
      );
    } catch {
      toast.error(
        transaction?.type === "EXPENSE"
          ? "Erro ao editar a despesa!"
          : "Erro ao editar a receita!",
      );
    }
  });

  const categories = useMemo(() => {
    return categoriesList.filter(
      (category) => category.type === transaction?.type,
    );
  }, [categoriesList, transaction]);

  async function handleDeleteTransaction() {
    try {
      await removeTransaction(transaction!.id);

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });
      onClose();
      toast.success(
        transaction?.type === "EXPENSE"
          ? "Despesa deletada com sucesso!"
          : "Receita deletada com sucesso!",
      );
    } catch {
      toast.error(
        transaction?.type === "EXPENSE"
          ? "Erro ao deletar a despesa!"
          : "Erro ao deletar a receita!",
      );
    }
  }

  function handleOpenDeleteModal() {
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  return {
    register,
    errors,
    control,
    handleSubmit,
    accounts,
    categories,
    isLoading,
    isDeleteModalOpen,
    isLoadingDelete,
    handleDeleteTransaction,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
  };
}
