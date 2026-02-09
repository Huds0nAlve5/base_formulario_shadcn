import { z } from "zod";

export const visaoSchema = z.object({
  nome: z.string().min(3, "Digite no mínimo 3 caracteres"),
  link: z.string().min(3, "Digite no mínimo 3 caracteres"),
  cpf: z
    .string()
    .min(11, "O CPF deve ter 11 dígitos")
    .refine(
      (value) => {
        const cpf = value.replace(/[^\d]+/g, "");

        if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
        return true;
      },
      { message: "CPF inválido" },
    ),
});

export type visao = z.infer<typeof visaoSchema>;
