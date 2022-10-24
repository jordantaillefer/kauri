import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { ProgrammeBuilder } from "../../../../testUtils/builders/ProgrammeBuilder"
import { TestFailedError } from "../../../../testUtils/errors/TestFailedError"
import { Programme } from "../../../domain/Programme"
import { ProgrammeNotFoundError } from "../../../domain/errors/ProgrammeNotFoundError"
import { PrismaProgrammeRepository } from "../../../infrastructure/adapters/PrismaProgrammeRepository"

describe("PrismaProgrammeRepository", () => {
  let prismaProgrammeRepository: PrismaProgrammeRepository
  beforeEach(() => {
    prismaProgrammeRepository = new PrismaProgrammeRepository()
  })

  describe("creerProgramme", () => {
    it("doit creer un programme", async () => {
      // Arrange
      const programme: Programme = new ProgrammeBuilder().withId("54d9eb29-5410-4428-936f-9d252799e4ce").withUserId("idUtilisateur").withNomProgramme("nomProgramme").build()
      // Act
      await prismaProgrammeRepository.creerProgramme(programme)
      // Assert
      const programmeResult = await prismaProgrammeRepository.recupererParId("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(programmeResult).toBeDefined()
      expect(programmeResult?.id).toEqual("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(programmeResult?.idUtilisateur).toEqual("idUtilisateur")
      expect(programmeResult?.nomProgramme).toEqual("nomProgramme")
    })
  })

  describe("recupererParId", () => {
    it("S'il existe, doit récupérer le programme", async () => {
      // Arrange
      const programme: Programme = new ProgrammeBuilder().withId("54d9eb29-5410-4428-936f-9d252799e4ce").withUserId("idUtilisateur").withNomProgramme("nomProgramme").build()
      await prismaProgrammeRepository.creerProgramme(programme)
      // Act
      const programmeResult = await prismaProgrammeRepository.recupererParId("54d9eb29-5410-4428-936f-9d252799e4ce")
      // Assert
      expect(programmeResult).toBeDefined()
      expect(programmeResult?.id).toEqual("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(programmeResult?.idUtilisateur).toEqual("idUtilisateur")
      expect(programmeResult?.nomProgramme).toEqual("nomProgramme")
    })
    it("S'il n'existe pas, doit renvoyer une erreur", async () => {
      // Arrange
      const programme: Programme = new ProgrammeBuilder().withId("54d9eb29-5410-4428-936f-9d252799e4ce").withUserId("idUtilisateur").withNomProgramme("nomProgramme").build()
      await prismaProgrammeRepository.creerProgramme(programme)
      try {
        // Act
        await prismaProgrammeRepository.recupererParId("5a46ae9c-b075-4665-9dc5-8d2793871a1e")
        throw new TestFailedError()
      } catch (error: unknown) {
        // Assert
        expect(error).toBeInstanceOf(ProgrammeNotFoundError)
        expect((error as ProgrammeNotFoundError).reasonPhrase).toEqual(ReasonPhrases.NOT_FOUND)
      }
    })
  })

  describe("recupererTout", () => {
    it("Doit récupérer tous les programmes", async () => {
      // Arrange
      const programme1 = Programme.creerProgramme({
        id: "fbefd9d8-d478-419a-9b0e-c5a93c0dbb78",
        idUtilisateur: "idUtilisateur1",
        nomProgramme: "nomProgramme1"
      })
      const programme2 = Programme.creerProgramme({
        id: "86568a1e-9915-4872-989b-8e21bf5ac640",
        idUtilisateur: "idUtilisateur2",
        nomProgramme: "nomProgramme2"
      })
      await prismaProgrammeRepository.creerProgramme(programme1)
      await prismaProgrammeRepository.creerProgramme(programme2)
      // Act
      const listeDeProgrammes = await prismaProgrammeRepository.recupererTout()
      // Assert
      expect(listeDeProgrammes).toHaveLength(2)

      expect(listeDeProgrammes.at(0)?.id).toEqual("fbefd9d8-d478-419a-9b0e-c5a93c0dbb78")
      expect(listeDeProgrammes.at(0)?.idUtilisateur).toEqual("idUtilisateur1")
      expect(listeDeProgrammes.at(0)?.nomProgramme).toEqual("nomProgramme1")
      expect(listeDeProgrammes.at(1)?.id).toEqual("86568a1e-9915-4872-989b-8e21bf5ac640")
      expect(listeDeProgrammes.at(1)?.idUtilisateur).toEqual("idUtilisateur2")
      expect(listeDeProgrammes.at(1)?.nomProgramme).toEqual("nomProgramme2")
    })
  })

  describe("recupererToutPourLUtilisateur", () => {
    it("Doit récupérer tous les programmes pour un utilisateur", async () => {
      // Arrange
      const programme1 = Programme.creerProgramme({
        id: "fbefd9d8-d478-419a-9b0e-c5a93c0dbb78",
        idUtilisateur: "idUtilisateur1",
        nomProgramme: "nomProgramme1"
      })
      const programme2 = Programme.creerProgramme({
        id: "86568a1e-9915-4872-989b-8e21bf5ac640",
        idUtilisateur: "idUtilisateur2",
        nomProgramme: "nomProgramme2"
      })
      await prismaProgrammeRepository.creerProgramme(programme1)
      await prismaProgrammeRepository.creerProgramme(programme2)
      // Act
      const listeDeProgrammes = await prismaProgrammeRepository.recupererToutPourLUtilisateur("idUtilisateur1")
      // Assert
      expect(listeDeProgrammes).toHaveLength(1)

      expect(listeDeProgrammes.at(0)?.id).toEqual("fbefd9d8-d478-419a-9b0e-c5a93c0dbb78")
      expect(listeDeProgrammes.at(0)?.idUtilisateur).toEqual("idUtilisateur1")
      expect(listeDeProgrammes.at(0)?.nomProgramme).toEqual("nomProgramme1")
    })
  })
})
