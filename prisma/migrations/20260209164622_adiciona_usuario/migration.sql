-- CreateTable
CREATE TABLE "Usuario" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);
