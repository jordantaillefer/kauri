/*
  Warnings:

  - You are about to drop the column `tempsRepos` on the `ExerciceSeance` table. All the data in the column will be lost.
  - Added the required column `tempsRepos` to the `SerieExerciceSeance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExerciceSeance" DROP COLUMN "tempsRepos";

-- AlterTable
ALTER TABLE "SerieExerciceSeance" ADD COLUMN "tempsRepos" INTEGER;

UPDATE "SerieExerciceSeance" SET "tempsRepos" = 45;


ALTER TABLE "SerieExerciceSeance" ALTER COLUMN "tempsRepos" SET NOT NULL;
