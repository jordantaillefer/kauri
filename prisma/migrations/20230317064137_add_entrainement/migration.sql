-- CreateTable
CREATE TABLE "Entrainement" (
    "id" TEXT NOT NULL,
    "nomSeance" TEXT NOT NULL,

    CONSTRAINT "Entrainement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciceEntrainement" (
    "id" TEXT NOT NULL,
    "idEntrainement" TEXT NOT NULL,
    "estRealise" BOOLEAN NOT NULL,
    "tempsRepos" INTEGER NOT NULL,
    "nomExercice" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,

    CONSTRAINT "ExerciceEntrainement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SerieEntrainement" (
    "id" TEXT NOT NULL,
    "idExerciceEntrainement" TEXT NOT NULL,
    "nombreRepetition" INTEGER NOT NULL,

    CONSTRAINT "SerieEntrainement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExerciceEntrainement" ADD CONSTRAINT "ExerciceEntrainement_idEntrainement_fkey" FOREIGN KEY ("idEntrainement") REFERENCES "Entrainement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SerieEntrainement" ADD CONSTRAINT "SerieEntrainement_idExerciceEntrainement_fkey" FOREIGN KEY ("idExerciceEntrainement") REFERENCES "ExerciceEntrainement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
