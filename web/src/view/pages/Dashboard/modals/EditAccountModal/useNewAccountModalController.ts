import { bankAccountsService } from "../../../../../app/services/bankAccountsService/index";
import z from "zod";
import { useDashboard } from "../../components/DashboardContext/useDashboard";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";
import toast from "react-hot-toast";

const schema = z.object({
  initialBalance: z.string().min(1, "Saldo inicial é obrigatório"),
  name: z.string().min(1, "Nome da conta é obrigatório"),
  type: z.enum(["CHECKING", "INVESTMENT", "CASH"], {
    message: "Tipo de conta é obrigatório",
  }),
  color: z.string().min(1, "Cor é obrigatória"),
});

type FormData = z.infer<typeof schema>;

export function useEditAccountModalController() {
  const { isEditAccountModalOpen, closeEditAccountModal } = useDashboard();

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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
      closeEditAccountModal();
      reset();
    } catch {
      toast.error("Erro ao criar conta!");
    }
  });

  return {
    isEditAccountModalOpen,
    closeEditAccountModal,
    register,
    handleSubmit,
    errors,
    control,
    isLoading,
  };
}
