import { describe, expect, it } from "vitest"

import { CATEGORIE } from "../../../../exercice/domain/categorie"
import { SeanceBuilder } from "../../../../testUtils/builders/SeanceBuilder"
import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
import { ExerciceSeance } from "../../../domain/ExerciceSeance"
import { Seance } from "../../../domain/Seance"
import { PrismaExerciceSeanceRepository } from "../../../infrastructure/adapters/PrismaExerciceSeanceRepository"
import { PrismaSeanceRepository } from "../../../infrastructure/adapters/PrismaSeanceRepository"

describe("PrismaExerciceSeanceRepository", () => {
  let prismaExerciceSeanceRepository: PrismaExerciceSeanceRepository
  let prismaSeanceRepository: PrismaSeanceRepository
  beforeEach(() => {
    prismaExerciceSeanceRepository = new PrismaExerciceSeanceRepository()
    prismaSeanceRepository = new PrismaSeanceRepository()
  })

  describe("#creerExerciceSeance", () => {
    it("doit créer l'exercice d'une séance", async () => {
      // Arrange
      const seance: Seance = new SeanceBuilder()
        .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
        .build()
      await prismaSeanceRepository.creerSeance(seance)

      const exerciceSeance: ExerciceSeance = new ExerciceSeanceBuilder()
        .withId("5689ac30-8cb5-4bc8-9a6f-babd46668724")
        .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
        .withIdExercice("idExercice")
        .withNomExercice("nomExercice")
        .withCategorie(CATEGORIE.ABDOMINAUX)
        .build()
      // Act

      await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)
      // Assert
      const exerciceResult = await prismaExerciceSeanceRepository.recupererTout()
      expect(exerciceResult).toHaveLength(1)
      expect(exerciceResult.at(0)?.id).toEqual("5689ac30-8cb5-4bc8-9a6f-babd46668724")
      expect(exerciceResult.at(0)?.idSeance).toEqual("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(exerciceResult.at(0)?.idExercice).toEqual("idExercice")
      expect(exerciceResult.at(0)?.nomExercice).toEqual("nomExercice")
      expect(exerciceResult.at(0)?.categorie).toEqual(CATEGORIE.ABDOMINAUX)
    })
  })
})