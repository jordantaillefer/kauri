import { ReasonPhrases } from "http-status-codes"
import { expect, it } from "vitest"

import { CATEGORIE } from "../../../../exercice/domain/categorie"
import { ExerciceBuilder } from "../../../application/builders/ExerciceBuilder"
import { ExerciceNotFoundError } from "../../../domain/errors/ExerciceNotFoundError"
import { PrismaSeanceExerciceRepository } from "../../../infrastructure/adapters/PrismaSeanceExerciceRepository"

describe("PrismaExerciceRepository", () => {
  let prismaSeanceRepository: PrismaSeanceExerciceRepository
  beforeEach(() => {
    prismaSeanceRepository = new PrismaSeanceExerciceRepository()
  })

  describe("#recupererParId", () => {
    it("quand l'exercice existe, doit récuperer l'exercice", async () => {
      // Arrange
      const exercice = new ExerciceBuilder()
        .withId("68a14593-691a-4749-a61c-cf8f49ed64ea")
        .withNomExercice("nomExercice")
        .withCategorie(CATEGORIE.ABDOMINAUX)
        .build()
      await prismaSeanceRepository.creerExercice(exercice)
      // Act
      const exerciceResult = await prismaSeanceRepository.recupererParId("68a14593-691a-4749-a61c-cf8f49ed64ea")
      // Assert
      expect(exerciceResult.id).toEqual("68a14593-691a-4749-a61c-cf8f49ed64ea")
      expect(exerciceResult.nomExercice).toEqual("nomExercice")
      expect(exerciceResult.categorie).toEqual(CATEGORIE.ABDOMINAUX)
    })
    it("quand l'exercice n'existe pas, doit remonter une erreur", async () => {
      // Arrange
      expect.assertions(2)
      const exercice = new ExerciceBuilder()
        .withId("68a14593-691a-4749-a61c-cf8f49ed64ea")
        .withNomExercice("nomExercice")
        .withCategorie(CATEGORIE.ABDOMINAUX)
        .build()
      await prismaSeanceRepository.creerExercice(exercice)
      // Act
      try {
        // Act
        await prismaSeanceRepository.recupererParId("4a46ae9c-b075-4665-9dc5-8d2793871a1e")
      } catch (error: unknown) {
        // Assert
        expect(error).toBeInstanceOf(ExerciceNotFoundError)
        expect((error as ExerciceNotFoundError).reasonPhrase).toEqual(ReasonPhrases.NOT_FOUND)
      }
    })
  })
})