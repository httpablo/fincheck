import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { httpClient } from "../../../app/services/HttpCliente";

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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const handleSubmit = hookFormHandleSubmit(async (data) => {
    await httpClient.post("/auth/signin", data);
  });

  return { handleSubmit, register, errors, isSubmitting };
}
