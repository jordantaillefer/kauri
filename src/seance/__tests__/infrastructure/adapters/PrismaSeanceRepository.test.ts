import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { SeanceBuilder } from "../../../../testUtils/builders/SeanceBuilder"
import { Seance } from "../../../domain/Seance"
import { SeanceNotFoundError } from "../../../domain/errors/SeanceNotFoundError"
import { PrismaSeanceRepository } from "../../../infrastructure/adapters/PrismaSeanceRepository"

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

  describe("recupererSeanceParId", () => {
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

  describe("recupererTout", () => {
    it("quand il n'existe aucun séance, remonte un tableau vide", async () => {
      // Act
      const listeSeanceResult = await prismaSeanceRepository.recupererTout("idUtilisateur")
      // Assert
      expect(listeSeanceResult).toHaveLength(0)
    })
    it("quand il existe des séances appartenant à l'utilisateur, remonte le tableau de ses séances", async () => {
      // Arrange
      const seanceUtilisateur1: Seance = new SeanceBuilder()
        .withId("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
        .withIdUtilisateur("idUtilisateur")
        .withNomSeance("Seance 1")
        .build()
      const seanceUtilisateur2: Seance = new SeanceBuilder()
        .withId("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
        .withIdUtilisateur("idUtilisateur")
        .withNomSeance("Seance 2")
        .build()
      const seanceAutreUtilisateur: Seance = new SeanceBuilder()
        .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
        .withIdUtilisateur("idAutreUtilisateur")
        .build()
      await prismaSeanceRepository.creerSeance(seanceUtilisateur1)
      await prismaSeanceRepository.creerSeance(seanceUtilisateur2)
      await prismaSeanceRepository.creerSeance(seanceAutreUtilisateur)

      // Act
      const listeSeanceResult = await prismaSeanceRepository.recupererTout("idUtilisateur")
      // Assert
      expect(listeSeanceResult).toHaveLength(2)
      expect(listeSeanceResult.at(0)?.id).toEqual("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
      expect(listeSeanceResult.at(0)?.nomSeance).toEqual("Seance 1")
      expect(listeSeanceResult.at(1)?.id).toEqual("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
      expect(listeSeanceResult.at(1)?.nomSeance).toEqual("Seance 2")
    })
  })
})
