/*
  Warnings:

  - You are about to drop the column `idUtilisateur` on the `Programme` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Programme` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
 ALTER TABLE "Programme"
 RENAME COLUMN "userId" to "idUtilisateur";
