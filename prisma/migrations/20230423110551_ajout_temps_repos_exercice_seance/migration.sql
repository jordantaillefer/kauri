/*
  Warnings:

  - Added the required column `tempsRepos` to the `ExerciceSeance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExerciceSeance" ADD COLUMN "tempsRepos" INTEGER NOT NULL DEFAULT(45);
ALTER TABLE "ExerciceSeance" ALTER COLUMN     "tempsRepos" DROP DEFAULT;
