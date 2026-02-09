"use server";

import prisma from "@/lib/prisma";
import { visaoSchema, visao } from "@/schemas/visao";

export async function criarVisao(dados: visao) {
  const validacaoVisao = visaoSchema.safeParse(dados);

  if (!validacaoVisao.success) {
    return { error: "Dados inválidos no servidor." };
  }

  try {
    const novaVisao = await prisma.visao.create({
      data: validacaoVisao.data,
    });
    return { sucess: true, nome: novaVisao.nome };
  } catch (error) {
    console.error("Erro ao salvar:", error);
    return { error: "Erro ao salvar no banco de dados." };
  }
}
