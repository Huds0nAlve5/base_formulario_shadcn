"use client";

import { alterarUsuario, getUniqueUsuario } from "@/actions/usuario";
import { Button, buttonVariants } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";

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
import { usuarioFormSchema, usuarioFormType } from "@/schemas/usuario";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { use, useEffect } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function editarUsuario({ params }: PageProps) {
  const { id } = use(params);

  const form = useForm<usuarioFormType>({
    resolver: zodResolver(usuarioFormSchema),
    //mode: "onChange",
    defaultValues: {
      nome: "",
      sobrenome: "",
      senha: "",
    },
  });

  async function funcaoAlteracaoUsuario(id: string, usuario: usuarioFormType) {
    const toastId = toast.loading("Carregando dados do usuário...");
    const validaUsuarioAlterado = await alterarUsuario(id, usuario);

    if (validaUsuarioAlterado.sucess) {
      toast.success(
        `Usuário "${validaUsuarioAlterado.usuario?.nome}" alterado com sucesso`,
        {
          id: toastId,
        },
      );
      redirect("/usuarios");
    } else {
      toast.error(`Erro ao alterar usuário: ${validaUsuarioAlterado.error}`, {
        id: toastId,
      });
    }
  }

  useEffect(() => {
    async function usuarioASerAlterado(id: string) {
      const toastId = toast.loading("Carregando dados do usuário...");
      const validaUsuario = await getUniqueUsuario(id);

      if (validaUsuario.sucess) {
        form.reset({
          nome: validaUsuario.usuario?.nome,
          sobrenome: validaUsuario.usuario?.sobrenome,
          senha: "",
        });
        toast.dismiss(toastId);
      } else {
        toast.error(`Erro ao alterar usuário: ${validaUsuario.error}`, {
          id: toastId,
        });
      }
    }

    usuarioASerAlterado(id);
  }, [id, form]);

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <Card className="w-100">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((usuario: usuarioFormType) =>
                funcaoAlteracaoUsuario(id, usuario),
              )} //passando mais de 1 parâmetro para ação ao submit
              className="space-y-4 w-full"
            >
              <CardHeader>
                <Link
                  href={"/usuarios"}
                  className={buttonVariants({ variant: "link" })}
                >
                  <span className="w-full flex gap-x-1 hover:gap-x-2.5 duration-500 justify-end items-center">
                    <IoArrowBack /> Voltar para a listagem
                  </span>
                </Link>
                <CardTitle className="text-[20px] text-center">
                  Cadastro de usuário
                </CardTitle>
                <CardDescription className="text-center">
                  Insira nome, sobrenome e sua senha
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sobrenome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input {...field} type="password"></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex-col space-y-2">
                <Button className="w-full cursor-pointer" type="submit">
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  className="w-full cursor-pointer"
                  onClick={() =>
                    form.reset({ nome: "", sobrenome: "", senha: "" })
                  }
                >
                  Limpar
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
}
