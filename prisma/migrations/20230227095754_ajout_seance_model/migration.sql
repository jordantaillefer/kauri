-- CreateTable
CREATE TABLE "Seance" (
    "id" TEXT NOT NULL,
    "nomSeance" TEXT NOT NULL,
    "idUtilisateur" TEXT NOT NULL,

    CONSTRAINT "Seance_pkey" PRIMARY KEY ("id")
);
