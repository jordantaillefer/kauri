-- CreateTable
CREATE TABLE "SportifEvenement" (
    "id" TEXT NOT NULL,
    "idSeance" TEXT NOT NULL,
    "idUtilisateur" TEXT NOT NULL,
    "tempsEvenement" TEXT NOT NULL,

    CONSTRAINT "SportifEvenement_pkey" PRIMARY KEY ("id")
);
