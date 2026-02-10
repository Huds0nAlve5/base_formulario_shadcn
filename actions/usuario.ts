"use server";

import {
  UsuarioBancoType,
  usuarioFormSchema,
  usuarioFormType,
} from "@/schemas/usuario";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type objetoDeRetorno = {
  sucess?: boolean;
  error?: string;
  message?: string;
  nome?: string;
  usuario?: UsuarioBancoType;
};

export async function addUsuario(
  usuario: usuarioFormType,
): Promise<objetoDeRetorno> {
  const validacaoUsuario = usuarioFormSchema.safeParse(usuario);

  if (!validacaoUsuario.success) {
    return { error: "Dados inválidos no servidor." };
  }

  const { nome, sobrenome, senha } = validacaoUsuario.data;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: { nome: nome, sobrenome: sobrenome, senha: senhaCriptografada },
    });
    return { sucess: true, nome: novoUsuario.nome };
  } catch (e) {
    return { error: `Erro ao salvar no banco de dados: ${e}` };
  }
}

export async function getAllUsuarios(): Promise<UsuarioBancoType[]> {
  try {
    const usuarios: UsuarioBancoType[] = await prisma.usuario.findMany({
      orderBy: { nome: "asc" },
    });
    return usuarios;
  } catch {
    return [];
  }
}

export async function delUsuario(id: string): Promise<objetoDeRetorno> {
  const verificacaoPessoa = await prisma.usuario.findUnique({
    where: { id: id },
  });

  if (!verificacaoPessoa) {
    return {
      error: "Erro na exclusão! Usuário não encontrado no banco de dados",
    };
  }

  try {
    await prisma.usuario.delete({ where: { id: id } });
    revalidatePath("/usuarios");
    return {
      sucess: true,
      message: `Usuário "${verificacaoPessoa.nome}" excluído com sucesso`,
    };
  } catch (e) {
    return { error: `Erro na exclusão do usuário "${verificacaoPessoa.nome}"` };
  }
}

export async function getUniqueUsuario(id: string): Promise<objetoDeRetorno> {
  const verificacaoPessoa = await prisma.usuario.findUnique({
    where: { id: id },
  });

  if (!verificacaoPessoa) {
    return {
      error: "Erro na exclusão! Usuário não encontrado no banco de dados",
    };
  }

  try {
    await prisma.usuario.findUnique({ where: { id: id } });
    return {
      sucess: true,
      usuario: verificacaoPessoa,
    };
  } catch (e) {
    return {
      error: `Erro ao buscar dados do usuário "${verificacaoPessoa.nome}"`,
    };
  }
}

export async function alterarUsuario(
  id: string,
  usuarioAtualizado: usuarioFormType,
): Promise<objetoDeRetorno> {
  const senhaCriptografada = await bcrypt.hash(usuarioAtualizado.senha, 10);
  const verificacaoPessoa = await prisma.usuario.findUnique({
    where: { id: id },
  });

  if (!verificacaoPessoa) {
    return {
      error: "Erro na exclusão! Usuário não encontrado no banco de dados",
    };
  }

  try {
    await prisma.usuario.update({
      where: { id: id },
      data: {
        nome: usuarioAtualizado.nome,
        sobrenome: usuarioAtualizado.sobrenome,
        senha: senhaCriptografada,
      },
    });
    return {
      sucess: true,
      usuario: verificacaoPessoa,
    };
  } catch (e) {
    return {
      error: `Erro ao buscar dados do usuário "${verificacaoPessoa.nome}"`,
    };
  }
}
