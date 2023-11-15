-- DropForeignKey
ALTER TABLE "ExerciceEntrainement" DROP CONSTRAINT "ExerciceEntrainement_idEntrainement_fkey";

-- DropForeignKey
ALTER TABLE "ExerciceSeance" DROP CONSTRAINT "ExerciceSeance_idSeance_fkey";

-- DropForeignKey
ALTER TABLE "SerieEntrainement" DROP CONSTRAINT "SerieEntrainement_idExerciceEntrainement_fkey";

-- DropForeignKey
ALTER TABLE "SerieExerciceSeance" DROP CONSTRAINT "SerieExerciceSeance_idExerciceSeance_fkey";

-- AddForeignKey
ALTER TABLE "ExerciceSeance" ADD CONSTRAINT "ExerciceSeance_idSeance_fkey" FOREIGN KEY ("idSeance") REFERENCES "Seance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SerieExerciceSeance" ADD CONSTRAINT "SerieExerciceSeance_idExerciceSeance_fkey" FOREIGN KEY ("idExerciceSeance") REFERENCES "ExerciceSeance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciceEntrainement" ADD CONSTRAINT "ExerciceEntrainement_idEntrainement_fkey" FOREIGN KEY ("idEntrainement") REFERENCES "Entrainement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SerieEntrainement" ADD CONSTRAINT "SerieEntrainement_idExerciceEntrainement_fkey" FOREIGN KEY ("idExerciceEntrainement") REFERENCES "ExerciceEntrainement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
