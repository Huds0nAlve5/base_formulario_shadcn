import { getAllUsuarios } from "@/actions/usuario";
import { DataTable } from "@/components/ui/data-table";
import { UsuarioBancoType } from "@/schemas/usuario";
import { columns } from "./columns";

export default async function Lista_Usuarios() {
  const usuarios: UsuarioBancoType[] = await getAllUsuarios();
  return (
    <>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={usuarios} />
      </div>
    </>
  );
}
