-- CreateTable
CREATE TABLE "Clube" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "nome" TEXT NOT NULL,

    CONSTRAINT "Clube_pkey" PRIMARY KEY ("id")
);
