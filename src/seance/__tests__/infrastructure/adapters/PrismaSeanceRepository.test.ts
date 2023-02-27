import { describe, expect, it } from "vitest"

import { SeanceBuilder } from "../../../../testUtils/builders/SeanceBuilder"
import { Seance } from "../../../domain/Seance"
import { PrismaSeanceRepository } from "../../../infrastructure/adapters/PrismaSeanceRepository"
import { ProgrammeNotFoundError } from "../../../../entrainement/domain/errors/ProgrammeNotFoundError"
import { ReasonPhrases } from "http-status-codes"
import { SeanceNotFoundError } from "../../../domain/errors/SeanceNotFoundError"

describe("PrismaSeanceRepository", () => {
  let prismaSeanceRepository: PrismaSeanceRepository
  beforeEach(() => {
    prismaSeanceRepository = new PrismaSeanceRepository()
  })

  describe("creerSeance", () => {
    it("doit creer un seance", async () => {
      // Arrange
      const seance: Seance = new SeanceBuilder()
        .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
        .build()
      // Act
      await prismaSeanceRepository.creerSeance(seance)
      // Assert
      const seanceResult = await prismaSeanceRepository.recupererParId("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(seanceResult).toBeDefined()
      expect(seanceResult?.id).toEqual("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(seanceResult?.idUtilisateur).toEqual("idUtilisateur")
      expect(seanceResult?.nomSeance).toEqual("nomSeance")
    })
  })

  describe("récupererSeanceParId", () => {
    it("quand la séance existe, doit récuperer la séance", async () => {
      // Arrange
      const seance: Seance = new SeanceBuilder()
        .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
        .build()
      await prismaSeanceRepository.creerSeance(seance)
      // Act
      const seanceResult = await prismaSeanceRepository.recupererParId("54d9eb29-5410-4428-936f-9d252799e4ce")
      // Assert
      expect(seanceResult).toBeDefined()
      expect(seanceResult?.id).toEqual("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(seanceResult?.idUtilisateur).toEqual("idUtilisateur")
      expect(seanceResult?.nomSeance).toEqual("nomSeance")
    })
    it("quand la séance n'existe pas, doit remonter une erreur", async () => {
      // Arrange
      expect.assertions(2)
      const seance: Seance = new SeanceBuilder()
        .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
        .build()
      await prismaSeanceRepository.creerSeance(seance)
      // Act
      try {
        // Act
        await prismaSeanceRepository.recupererParId("4a46ae9c-b075-4665-9dc5-8d2793871a1e")
      } catch (error: unknown) {
        // Assert
        expect(error).toBeInstanceOf(SeanceNotFoundError)
        expect((error as SeanceNotFoundError).reasonPhrase).toEqual(ReasonPhrases.NOT_FOUND)
      }
    })
  })
})
