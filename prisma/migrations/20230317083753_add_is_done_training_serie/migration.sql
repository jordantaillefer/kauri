/*
  Warnings:

  - Added the required column `estRealise` to the `SerieEntrainement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SerieEntrainement" ADD COLUMN     "estRealise" BOOLEAN NOT NULL;
