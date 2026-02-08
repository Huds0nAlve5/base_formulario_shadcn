"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const visaoSchema = z.object({
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

type visao = z.infer<typeof visaoSchema>;

export default function Home() {
  const form = useForm<visao>({
    resolver: zodResolver(visaoSchema),
    // mode: "onChange",
    defaultValues: {
      nome: "",
      link: "",
    },
  });

  function onSubmit(data: visao) {
    console.log("Dados prontos para o banco:", data);
  }
  return (
    <>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Cadastro de Visão</CardTitle>
              <CardDescription>
                Insira os dados relacionado ao BI
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da visão</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link da visão</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Insira o CPF"></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">Cadastrar</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
}
