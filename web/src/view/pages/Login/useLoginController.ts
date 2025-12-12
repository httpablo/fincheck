import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../../../app/services/AuthService";
import toast from "react-hot-toast";
import type { SigninParams } from "../../../app/services/AuthService/signin";
import { useAuth } from "../../../app/hooks/useAuth";

const schema = z.object({
  email: z.email({ message: "Informe um e-mail válido" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter ao menos 8 caracteres" }),
});

type FormData = z.infer<typeof schema>;

export function useLoginController() {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (data: SigninParams) => {
      return AuthService.signin(data);
    },
  });

  const { signin } = useAuth();

  const { mutateAsync, status } = mutation;
  const isLoading = status === "pending";

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      const { accessToken } = await mutateAsync(data);

      signin(accessToken);
    } catch {
      toast.error("Credenciais inválidas!");
    }
  });

  return { handleSubmit, register, errors, isSubmitting, isLoading };
}
