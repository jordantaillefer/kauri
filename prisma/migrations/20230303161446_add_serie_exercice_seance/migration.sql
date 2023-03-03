-- CreateTable
CREATE TABLE "SerieExerciceSeance" (
    "id" TEXT NOT NULL,
    "idExerciceSeance" TEXT NOT NULL,
    "repetitions" INTEGER NOT NULL,

    CONSTRAINT "SerieExerciceSeance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SerieExerciceSeance" ADD CONSTRAINT "SerieExerciceSeance_idExerciceSeance_fkey" FOREIGN KEY ("idExerciceSeance") REFERENCES "ExerciceSeance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
