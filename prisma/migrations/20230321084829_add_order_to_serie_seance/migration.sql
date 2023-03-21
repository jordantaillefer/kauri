/*
  Warnings:

  - Added the required column `ordre` to the `SerieExerciceSeance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SerieExerciceSeance" ADD COLUMN     "ordre" INTEGER NOT NULL;
