import { string, z } from "zod";

export const usuarioFormSchema = z.object({
  nome: string()
    .min(1, "Campo não preenchido")
    .max(50, "Máximo de 50 caracteres atingido"),
  sobrenome: string()
    .min(1, "Campo não preenchido")
    .max(50, "Máximo de 50 caracteres atingido"),
  senha: string()
    .min(8, "Insira no mínimo 8 caracteres")
    .max(50, "Máximo de 50 caracteres atingido"),
});

export const usuarioBancoSchema = usuarioFormSchema.extend({
  id: z.string(),
  updatedAt: z.date(),
});

export type usuarioFormType = z.infer<typeof usuarioFormSchema>;
export type UsuarioBancoType = z.infer<typeof usuarioBancoSchema>;
