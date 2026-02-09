import { getAllUsuarios } from "@/actions/usuario";
import { Button } from "@/components/ui/button";

export default async function Lista_Usuarios() {
  const usuarios = await getAllUsuarios();
  return (
    <>
      <h1>Lista de usuários</h1>
      <ul>
        {usuarios.map((user) => (
          <li key={user.id}>
            <p>{user.nome}</p>
            <Button className="cursor-pointer">Excluir</Button>
          </li>
        ))}
      </ul>
    </>
  );
}
