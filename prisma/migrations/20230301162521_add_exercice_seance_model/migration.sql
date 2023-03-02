-- CreateTable
CREATE TABLE "ExerciceSeance" (
    "id" TEXT NOT NULL,
    "idSeance" TEXT NOT NULL,
    "idExercice" TEXT NOT NULL,
    "nomExercice" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,

    CONSTRAINT "ExerciceSeance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExerciceSeance" ADD CONSTRAINT "ExerciceSeance_idSeance_fkey" FOREIGN KEY ("idSeance") REFERENCES "Seance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
