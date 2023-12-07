/*
  Warnings:

  - Added the required column `poids` to the `SerieExerciceSeance` table with 20 as default value.

*/
-- AlterTable
ALTER TABLE "SerieExerciceSeance" ADD COLUMN "poids" INTEGER;

UPDATE "SerieExerciceSeance" SET "poids" = 20;


ALTER TABLE "SerieExerciceSeance" ALTER COLUMN "poids" SET NOT NULL;
