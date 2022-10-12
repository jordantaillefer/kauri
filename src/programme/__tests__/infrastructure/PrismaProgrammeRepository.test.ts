import { describe, expect, it } from "vitest"

import { ProgrammeBuilder } from "../../../testUtils/builders/ProgrammeBuilder"
import { Programme } from "../../domain/Programme"
import { PrismaProgrammeRepository } from "../../infrastructure/adapters/PrismaProgrammeRepository"

describe("PrismaProgrammeRepository", () => {
  let prismaProgrammeRepository: PrismaProgrammeRepository
  beforeEach(() => {
    prismaProgrammeRepository = new PrismaProgrammeRepository()
  })

  describe("creerProgramme", () => {
    it("doit creer un programme", async () => {
      // Arrange
      const programme: Programme = new ProgrammeBuilder().withId("54d9eb29-5410-4428-936f-9d252799e4ce").withUserId("userId").withNomProgramme("nomProgramme").build()
      // Act
      await prismaProgrammeRepository.creerProgramme(programme)
      // Assert
      const programmeResult = await prismaProgrammeRepository.recupererParId("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(programmeResult).toBeDefined()
      expect(programmeResult?.id).toEqual("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(programmeResult?.userId).toEqual("userId")
      expect(programmeResult?.nomProgramme).toEqual("nomProgramme")
    })
  })
  describe("recupererParId", () => {
    it("S'il existe, doit récupérer le programme", async () => {
      // Arrange
      const programme: Programme = new ProgrammeBuilder().withId("54d9eb29-5410-4428-936f-9d252799e4ce").withUserId("userId").withNomProgramme("nomProgramme").build()
      await prismaProgrammeRepository.creerProgramme(programme)
      // Act
      const programmeResult = await prismaProgrammeRepository.recupererParId("54d9eb29-5410-4428-936f-9d252799e4ce")
      // Assert
      expect(programmeResult).toBeDefined()
      expect(programmeResult?.id).toEqual("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(programmeResult?.userId).toEqual("userId")
      expect(programmeResult?.nomProgramme).toEqual("nomProgramme")
    })
    it("S'il n'existe pas, doit renvoyer null", async () => {
      // Arrange
      const programme: Programme = new ProgrammeBuilder().withId("54d9eb29-5410-4428-936f-9d252799e4ce").withUserId("userId").withNomProgramme("nomProgramme").build()
      await prismaProgrammeRepository.creerProgramme(programme)
      // Act
      const programmeResult = await prismaProgrammeRepository.recupererParId("5a46ae9c-b075-4665-9dc5-8d2793871a1e")
      // Assert
      expect(programmeResult).toBeNull()
    })
  })
})