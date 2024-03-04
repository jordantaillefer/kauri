import { ReasonPhrases } from "http-status-codes"
import { expect, it } from "vitest"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import { ExerciceBuilder } from "../../../application/builders/ExerciceBuilder"
import { ExerciceNotFoundError } from "../../../domain/errors/ExerciceNotFoundError"
import { PrismaSeanceExerciceRepository } from "../../../infrastructure/adapters/PrismaSeanceExerciceRepository"
import { CATEGORIE } from "~/.server/exercice/domain/categorie"
import { getContainer } from "@/api/index.server"

describe("PrismaExerciceRepository", () => {
  describe("#recupererParId", () => {
    it(
      "quand l'exercice existe, doit récupérer l'exercice",
      integrationTestFunction(async ({ testIdGenerator, container }) => {
        // Arrange
        const prismaSeanceRepository = new PrismaSeanceExerciceRepository({
          correlationIdService: container.resolve('correlationIdService')
        })
        const uuidExercice = testIdGenerator.getId()
        const exercice = new ExerciceBuilder()
          .withId(uuidExercice)
          .withNomExercice("nomExercice")
          .withCategorie(CATEGORIE.ABDOMINAUX)
          .build()
        await prismaSeanceRepository.creerExercice(exercice)
        // Act
        const exerciceResult = await prismaSeanceRepository.recupererParId(uuidExercice)
        // Assert
        expect(exerciceResult.id).toEqual(uuidExercice)
        expect(exerciceResult.nomExercice).toEqual("nomExercice")
        expect(exerciceResult.categorie).toEqual(CATEGORIE.ABDOMINAUX)
      })
    )
    it(
      "quand l'exercice n'existe pas, doit remonter une erreur",
      integrationTestFunction(async ({ testIdGenerator, container }) => {
        // Arrange
        const prismaSeanceRepository = new PrismaSeanceExerciceRepository({
          correlationIdService: container.resolve('correlationIdService')
        })
        expect.assertions(2)
        const exercice = new ExerciceBuilder()
          .withId(testIdGenerator.getId())
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
    )
  })
})
