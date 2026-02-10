"use server";

import {
  UsuarioBancoType,
  usuarioFormSchema,
  usuarioFormType,
} from "@/schemas/usuario";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function addUsuario(usuario: usuarioFormType) {
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
