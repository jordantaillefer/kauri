-- CreateTable
CREATE TABLE "Programme" (
    "id" TEXT NOT NULL,
    "nomProgramme" TEXT NOT NULL,
    "idUtilisateur" TEXT NOT NULL,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);
