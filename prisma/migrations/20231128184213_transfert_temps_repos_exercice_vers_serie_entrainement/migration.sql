/*
  Warnings:

  - You are about to drop the column `tempsRepos` on the `ExerciceSeance` table. All the data in the column will be lost.
  - Added the required column `tempsRepos` to the `SerieExerciceSeance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExerciceEntrainement" DROP COLUMN "tempsRepos";

-- AlterTable
ALTER TABLE "SerieEntrainement" ADD COLUMN "tempsRepos" INTEGER;

UPDATE "SerieEntrainement" SET "tempsRepos" = 45;


ALTER TABLE "SerieEntrainement" ALTER COLUMN "tempsRepos" SET NOT NULL;
