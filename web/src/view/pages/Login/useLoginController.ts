import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const schema = z.object({
  email: z.email("Informe um e-mail válido"),
  password: z
    .string()
    .nonempty("A senha é obrigatória")
    .min(8, { message: "A senha deve ter ao menos 8 caracteres" }),
});

type FormData = z.infer<typeof schema>;

export function useLoginController() {
  const {
    register,
    handleSubmit: hookFormHandleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormHandleSubmit((data) => {
    const result = schema.safeParse(data);
    console.log(result);
  });

  return { handleSubmit, register, errors };
}
