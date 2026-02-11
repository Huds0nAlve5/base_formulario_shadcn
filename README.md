#Anotações anteriores

# Zod

Implementar schemas zed na pasta src/schemas, e dentro dela colocar separadamente os schemas seguindo o modelo do zod, esportando o modelo e o tipo

#Instalação do prisma
1º npm install prisma --save-dev
2º npx prisma init
3º Configurado a variável de ambiente com a conexão do banco
4º Criado o modelo no schema.prisma:

- model Visao {
  id String @id @default(dbgenerated("uuidv7()")) @db.Uuid
  nome String
  link String
  cpf String @unique  
   createdAt DateTime @default(now())  
   updatedAt DateTime @updatedAt  
   }

5º Execução dos comandos no banco:

- npx prisma migrate dev
  Cria e altera as tabelas no banco de dados (Postgres). Ele gera os arquivos .sql.

- Ajustar o generetor no schema.prisma para:
  generator client {
  provider = "prisma-client-js"
  }

- npx prisma generate
  Cria e atualiza as tipagens no código (TypeScript). Ele lê o schema e cria o "auto-completar"

6º Criar o arquivo prisma.ts na pasta lib para criação de uma conexão global

# Implementação dos schemas na pasta schemas

    import { string, z } from "zod";

    export const usuarioSchema = z.object({
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

    export type usuarioType = z.infer<typeof usuarioSchema>;

# Implementação das funções do prisma

1º Criar o arquivo app/actions/visao.ts. Lá vão ficar as funções do prisma que vão ser executadas apenas do lado do servidor:

- "use server";

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

# Implementação no frontend usando toast:

    async function cadastrarUsuario(usuario: usuarioType) {
    const toastId = toast.loading("Cadastrando usuário...");
    const novoUsuario = await addUsuario(usuario);

    if (novoUsuario.sucess) {
      toast.success(`Usuário "${novoUsuario.nome}" cadastrado com sucesso`, {
        id: toastId,
      });
      form.reset();
    } else {
      toast.error(`Erro: ${novoUsuario.error}`, {
        id: toastId,
      });
    }
    }

###### OBS: instalar sonner no projeto e adicionar <Toaster position="top-right" richColors /> no layout.tsx

###### OBS: Lembrar de usar "use server" nas actions e "use client" quando há necessidade de javascript no navegador do cliente (uso de hooks)

# Bibliotecas de criptografia

npm install bcrypt
npm install -D @types/bcrypt

# Criptografia de senhas

    import bcrypt from "bcrypt"

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

# Descriptografar senha para login

    const usuarioNoBanco = await prisma.usuario.findUnique({ where: { email } });

    const senhaCorreta = await bcrypt.compare(senhaDigitada, usuarioNoBanco.senha);

    if (senhaCorreta) {
    // Login autorizado
    }

# Listar todos os usuários

    export async function getAllUsuarios() {
    try {
    const usuarios = await prisma.usuario.findMany();
    return usuarios;
    } catch {
    return [];
    }
    }

# Datatable

O datatable foi montado no components, e o columns na mesma pasta do page
O datatable foi todo montado seguindo a documentação do shadcn

## OBS: lembrar de gerar o npx prisma generate para validações do TS no projeto novo

## Delete feito com revalidatePath("/usuarios"); para limpar o cache com os dados e recarregar a página

# Para acessar as props de uma página de alterar, por exemplo, /usuarios/[id]/editar:

    interface PageProps {
      params: Promise<{ id: string }>;
    }

    export default function editarUsuario({ params }: PageProps) {
        const { id } = use(params);

## Passando mais de 1 parâmetro para ação ao submit

    onSubmit={form.handleSubmit((usuario: usuarioFormType) =>
    alterarUsuario(id, usuario),

## Função de alteração usando useEffect, para funções server side dentro do client side

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

}, [form, id]);

## Crud implementado com sucesso.

## Lembretes:

- As funções server side ficam na pasta actions, na raiz do projeto
- Os schemas do projeto ficam na pasta schemas
- As funções em action devem retornar um error: string, sucess: boolean e message: string
- A função deve ser chamada em uma função assíncrona no front-end, com uma validação if(funcao.sucess), e aqui tendo toasts e redirects
- No formulário, o form processa no onHandleSubmit, a função assíncrona declarada, que chama a action
- useEffect vai servir para funções assíncronas que precisarão ser chamados no front-end, como funções que são executadas ao renderizar a página, como gets

## Nomenclatura padrão:

export async function createUsuario(data: usuarioFormType) { ... }

async function onSubmit(values: usuarioFormType) {
const toastId = toast.loading("Enviando...");
const res = await createUsuario(values);
...
}

<form onSubmit={form.handleSubmit(onSubmit)}>

# No action, nomes como create, delete, update, select

# No front-end, apenas a função padrão do formulário, como onSubmit
