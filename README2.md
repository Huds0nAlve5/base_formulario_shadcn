# Guia de Desenvolvimento: Fullstack Next.js

Este guia consolida as melhores práticas e fluxos de instalação para Shadcn/UI, Zod, Prisma, Actions e padrões de projeto.

## 1. Interface (Shadcn/UI & Sonner)

### Instalação do Shadcn: Siga o CLI para inicializar e adicionar componentes.

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add [componente]
```

### Feedback Visual (Sonner):

### Instale:

```bash
npm install sonner
```

### Adicione ao layout.tsx:

<Toaster position="top-right" richColors />

## 2. Validação de Dados (Zod)

### Implemente schemas na pasta src/schemas para centralizar a lógica de validação.

### Instalação:

```bash
npm install zod
```

### Modelo de Schema:

```typescript
import { z } from "zod";

export const usuarioSchema = z.object({
  nome: z.string().min(1, "Campo obrigatório").max(50),
  sobrenome: z.string().min(1, "Campo obrigatório").max(50),
  senha: z.string().min(8, "Mínimo 8 caracteres").max(50),
});

export type usuarioType = z.infer<typeof usuarioSchema>;
```

## 3. Banco de Dados (Prisma)

## Instalação e Configuração

### Pacotes:

```bash
npm install prisma --save-dev @prisma/client @prisma/adapter-pg
```

Init:

```bash
npx prisma init
```

### Singleton (lib/prisma.ts):

```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prismaClientSingleton = () => new PrismaClient({ adapter });

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}
const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
```

## Fluxo de Sincronização

### Altera o banco e gera o arquivo .sql.

```bash
 npx prisma migrate dev
```

### Atualiza as tipagens e o Auto-complete no VS Code.

```bash
  npx prisma generate
```

## 4. Server Actions (Backend)

### Crie em app/actions/visao.ts. Use sempre "use server".

```typescript
"use server";
import prisma from "@/lib/prisma";
import { visaoSchema, visaoType } from "@/schemas/visao";

export async function criarVisao(dados: visaoType) {
  const validacao = visaoSchema.safeParse(dados);
  if (!validacao.success) return { error: "Dados inválidos." };

  try {
    const novaVisao = await prisma.visao.create({ data: validacao.data });
    return { sucess: true, nome: novaVisao.nome };
  } catch (error) {
    return { error: "Erro ao salvar no banco." };
  }
}
```

## 5. Frontend & Hooks

## Padrão de Submit com Toast

```typescript
async function onSubmit(values: usuarioType) {
  const toastId = toast.loading("Enviando...");
  const res = await criarVisao(values);
  if (res.sucess) {
    toast.success(Sucesso: ${res.nome},
    { id: toastId }); form.reset();
    }
    else {
      toast.error(res.error, { id: toastId });
    }
}
```

## 6. Segurança e Criptografia (Bcrypt)

### Instalação:

```bash
npm install bcrypt npm install -D @types/bcrypt
```

## Criptografar:

```typescript
const hash = await bcrypt.hash(senha, 10);
```

## Comparar:

```typescript
const match = await bcrypt.compare(senhaDigitada, hashNoBanco);
```

## 7. Lembretes Finais

### Actions: Use nomes como create, delete, update, select.

### Frontend: A função padrão do formulário deve ser onSubmit.

### Cache: Use revalidatePath("/rota") na Action após mutações.

### Hooks: useEffect para carregar dados (GET) no Client Side.
