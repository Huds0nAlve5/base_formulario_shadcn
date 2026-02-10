"use client";

import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UsuarioBancoType } from "@/schemas/usuario";
import { toast } from "sonner";
import { delUsuario } from "@/actions/usuario";

async function deletarUsuario(id: string) {
  const toastId = toast.loading("Excluindo usuário...");
  const taskDelUsuario = await delUsuario(id);

  if (taskDelUsuario.sucess) {
    toast.success(`${taskDelUsuario.message}`, {
      id: toastId,
    });
  } else {
    toast.error(`Erro: ${taskDelUsuario.error}`, {
      id: toastId,
    });
  }
}

export const columns: ColumnDef<UsuarioBancoType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "sobrenome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sobrenome
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    id: "acoes",
    cell: ({ row }) => {
      const usuario = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(usuario.id)}
              className="cursor-pointer"
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <MdEdit className="text-black" />
              Alterar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-destructive! hover:text-white! cursor-pointer duration-400"
              onClick={() => {
                deletarUsuario(usuario.id);
              }}
            >
              <MdDelete className="hover:text-white" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
