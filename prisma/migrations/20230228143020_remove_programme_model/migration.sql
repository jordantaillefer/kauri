/*
  Warnings:

  - You are about to drop the `Programme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SeanceEntrainement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SeanceEntrainement" DROP CONSTRAINT "SeanceEntrainement_idProgramme_fkey";

-- DropTable
DROP TABLE "Programme";

-- DropTable
DROP TABLE "SeanceEntrainement";
