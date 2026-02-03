import { bankAccountsService } from "./../../../../../app/services/bankAccountsService/index";
import z from "zod";
import { useDashboard } from "../../components/DashboardContext/useDashboard";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";
import toast from "react-hot-toast";
import { useEffect } from "react";

const schema = z.object({
  initialBalance: z.string().min(1, "Saldo inicial é obrigatório"),
  name: z.string().min(1, "Nome da conta é obrigatório"),
  type: z.enum(["CHECKING", "INVESTMENT", "CASH"], {
    message: "Tipo de conta é obrigatório",
  }),
  color: z.string().min(1, "Cor é obrigatória"),
});

type FormData = z.infer<typeof schema>;

export function useNewAccountModalController() {
  const { isNewAccountModalOpen, closeNewAccountModal } = useDashboard();

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
    if (!isNewAccountModalOpen) {
      reset({
        name: "",
        initialBalance: "0",
        color: "",
        type: "CHECKING",
      });
    }
  }, [isNewAccountModalOpen, reset]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: bankAccountsService.create,
  });

  const { mutateAsync, status } = mutation;
  const isLoading = status === "pending";

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await mutateAsync({
        ...data,
        initialBalance: currencyStringToNumber(data.initialBalance),
      });

      await queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });
      toast.success("Conta criada com sucesso!");
      closeNewAccountModal();
    } catch {
      toast.error("Erro ao criar conta!");
    }
  });

  return {
    isNewAccountModalOpen,
    closeNewAccountModal,
    register,
    handleSubmit,
    errors,
    control,
    isLoading,
  };
}
