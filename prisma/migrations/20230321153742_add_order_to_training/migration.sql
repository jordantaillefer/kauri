/*
  Warnings:

  - Added the required column `ordre` to the `ExerciceEntrainement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ordre` to the `SerieEntrainement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExerciceEntrainement" ADD COLUMN     "ordre" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SerieEntrainement" ADD COLUMN     "ordre" INTEGER NOT NULL;
