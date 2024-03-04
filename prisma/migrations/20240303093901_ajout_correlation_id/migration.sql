-- AlterTable
ALTER TABLE "Entrainement" ADD COLUMN     "correlationId" TEXT;

-- AlterTable
ALTER TABLE "Exercice" ADD COLUMN     "correlationId" TEXT;

-- AlterTable
ALTER TABLE "ExerciceEntrainement" ADD COLUMN     "correlationId" TEXT;

-- AlterTable
ALTER TABLE "ExerciceSeance" ADD COLUMN     "correlationId" TEXT;

-- AlterTable
ALTER TABLE "Seance" ADD COLUMN     "correlationId" TEXT;

-- AlterTable
ALTER TABLE "SerieEntrainement" ADD COLUMN     "correlationId" TEXT;

-- AlterTable
ALTER TABLE "SerieExerciceSeance" ADD COLUMN     "correlationId" TEXT;

-- AlterTable
ALTER TABLE "SportifEvenement" ADD COLUMN     "correlationId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "correlationId" TEXT;

--- Add uuid
-- AlterTable
UPDATE "Entrainement" SET "correlationId" = '42e52a9e-e82a-4014-a384-6b4f6cbd42d3';

-- AlterTable
UPDATE "Exercice" SET "correlationId" = '42e52a9e-e82a-4014-a384-6b4f6cbd42d3';

-- AlterTable
UPDATE "ExerciceEntrainement" SET "correlationId" = '42e52a9e-e82a-4014-a384-6b4f6cbd42d3';

-- AlterTable
UPDATE "ExerciceSeance" SET "correlationId" = '42e52a9e-e82a-4014-a384-6b4f6cbd42d3';

-- AlterTable
UPDATE "Seance" SET "correlationId" = '42e52a9e-e82a-4014-a384-6b4f6cbd42d3';

-- AlterTable
UPDATE "SerieEntrainement" SET "correlationId" = '42e52a9e-e82a-4014-a384-6b4f6cbd42d3';

-- AlterTable
UPDATE "SerieExerciceSeance" SET "correlationId" = '42e52a9e-e82a-4014-a384-6b4f6cbd42d3';

-- AlterTable
UPDATE "SportifEvenement" SET "correlationId" = '42e52a9e-e82a-4014-a384-6b4f6cbd42d3';

-- AlterTable
UPDATE "User" SET "correlationId" = '42e52a9e-e82a-4014-a384-6b4f6cbd42d3';


-- NOT NULL
ALTER TABLE "Entrainement" ALTER COLUMN     "correlationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Exercice" ALTER COLUMN     "correlationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ExerciceEntrainement" ALTER COLUMN     "correlationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ExerciceSeance" ALTER COLUMN     "correlationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Seance" ALTER COLUMN     "correlationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "SerieEntrainement" ALTER COLUMN     "correlationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "SerieExerciceSeance" ALTER COLUMN     "correlationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "SportifEvenement" ALTER COLUMN     "correlationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN     "correlationId" SET NOT NULL;


