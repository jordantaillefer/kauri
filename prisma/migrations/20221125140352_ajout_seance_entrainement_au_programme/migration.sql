-- CreateTable
CREATE TABLE "SeanceEntrainement" (
    "id" TEXT NOT NULL,
    "dateSeance" TEXT NOT NULL,
    "idProgramme" TEXT NOT NULL,

    CONSTRAINT "SeanceEntrainement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SeanceEntrainement" ADD CONSTRAINT "SeanceEntrainement_idProgramme_fkey" FOREIGN KEY ("idProgramme") REFERENCES "Programme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
