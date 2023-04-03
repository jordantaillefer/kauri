/*
  Warnings:

  - Added the required column `idUtilisateur` to the `Entrainement` table with a default value for existing records then remove the default value to make it required.

*/
-- AlterTable
ALTER TABLE "Entrainement" ADD COLUMN "idUtilisateur" TEXT NOT NULL DEFAULT('113086919703832645762');
ALTER TABLE "Entrainement" ALTER COLUMN     "idUtilisateur" DROP DEFAULT;
