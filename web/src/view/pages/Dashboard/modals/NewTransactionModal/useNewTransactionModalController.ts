import z from "zod";
import { useDashboard } from "../../components/DashboardContext/useDashboard";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useForm } from "react-hook-form";
import { useBankAccounts } from "../../../../../app/hooks/useBankAccounts";
import { useCategories } from "../../../../../app/hooks/useCategories";
import { useMemo, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../../../../../app/services/transactionsService";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";
import { toast } from "react-hot-toast";

const schema = z.object({
  value: z.string().min(1, "O valor é obrigatório"),
  name: z.string().min(1, "O nome é obrigatório"),
  categoryId: z.string().min(1, "A categoria é obrigatória"),
  bankAccountId: z.string().min(1, "A conta é obrigatória"),
  date: z.date(),
});

type FormData = z.infer<typeof schema>;

export function useNewTransactionModalController() {
  const {
    isNewTransactionModalOpen,
    closeNewTransactionModal,
    newTransactionType,
  } = useDashboard();

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!isNewTransactionModalOpen) {
      reset({
        name: "",
        value: "0",
        bankAccountId: "",
        categoryId: "",
        date: new Date(),
      });
    }
  }, [isNewTransactionModalOpen, reset]);

  const queryClient = useQueryClient();
  const { accounts } = useBankAccounts();
  const { categories: categoriesList } = useCategories();
  const { status, mutateAsync } = useMutation({
    mutationFn: transactionService.create,
  });
  const isLoading = status === "pending";

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await mutateAsync({
        ...data,
        value: currencyStringToNumber(data.value),
        type: newTransactionType!,
        date: data.date.toISOString(),
      });

      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      await queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });
      toast.success(
        newTransactionType === "INCOME"
          ? "Receita criada com sucesso!"
          : "Despesa criada com sucesso!"
      );
      closeNewTransactionModal();
    } catch {
      toast.error(
        newTransactionType === "INCOME"
          ? "Erro ao criar receita."
          : "Erro ao criar despesa."
      );
    }
  });

  const categories = useMemo(() => {
    return categoriesList.filter(
      (category) => category.type === newTransactionType
    );
  }, [categoriesList, newTransactionType]);

  return {
    isNewTransactionModalOpen,
    closeNewTransactionModal,
    newTransactionType,
    register,
    errors,
    control,
    handleSubmit,
    accounts,
    categories,
    isLoading,
  };
}
