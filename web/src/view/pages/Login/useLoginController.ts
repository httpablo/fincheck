import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

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
    handleSubmit: hookFormHandleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const handleSubmit = hookFormHandleSubmit(async (data) => {
    try {
      return console.log("Login successful", data);
    } catch (e) {
      setError("email", {
        type: "server",
        message: "Erro ao tentar entrar. Verifique suas credenciais.",
      });
      return console.error("Login failed", e);
    }
  });

  return { handleSubmit, register, errors, isSubmitting };
}
