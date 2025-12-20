import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { AuthService } from "../../../app/services/authService";
import { useMutation } from "@tanstack/react-query";
import type { SignupParams } from "../../../app/services/authService/signup";
import toast from "react-hot-toast";
import { useAuth } from "../../../app/hooks/useAuth";

const schema = z.object({
  name: z.string().nonempty({ message: "O nome é obrigatório" }),
  email: z.email({ message: "Informe um e-mail válido" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter ao menos 8 caracteres" }),
});

type FormData = z.infer<typeof schema>;

export function useRegisterController() {
  const {
    handleSubmit: hookFormSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: SignupParams) => {
      return AuthService.signup(data);
    },
  });

  const { mutateAsync, status } = mutation;
  const isLoading = status === "pending";

  const { signin } = useAuth();

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      const { accessToken } = await mutateAsync(data);

      signin(accessToken);
    } catch {
      toast.error("Erro ao criar a conta!");
    }
  });

  return { handleSubmit, register, errors, isLoading };
}
