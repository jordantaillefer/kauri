/*
  Warnings:

  - Added the required column `ordre` to the `ExerciceSeance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExerciceSeance" ADD COLUMN     "ordre" INTEGER NOT NULL;
