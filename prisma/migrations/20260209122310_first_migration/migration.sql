-- CreateTable
CREATE TABLE "Visao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visao_cpf_key" ON "Visao"("cpf");
