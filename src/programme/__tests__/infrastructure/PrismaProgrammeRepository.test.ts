import { describe, expect } from "vitest"

import { Programme } from "../../domain/Programme"

class ProgrammeBuilder {
  private id: string
  private userId: string
  private nomProgramme: string

  withId(id: string): ProgrammeBuilder {
    this.id = id
    return this
  }


  withUserId(userId: string): ProgrammeBuilder {
    this.userId = userId
    return this
  }

  withNomProgramme(nomProgramme: string) {
    this.nomProgramme = nomProgramme
    return this
  }

  build() {
    return Programme.creerProgramme({ ...this })
  }
}

describe("PrismaProgrammeRepository", () => {
  describe("creerProgramme", () => {
    it("doit creer un programme", () => {
      // Arrange
      const programme: Programme = new ProgrammeBuilder().withId("54d9eb29-5410-4428-936f-9d252799e4ce").withUserId("userId").withNomProgramme("nomProgramme").build()
      // Act
      await prismaProgrammeRepository.creerProgramme(programme)
      // Assert test notion
      const programmeResult = await prismaProgrammeRepository.recupererParId("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(programmeResult.id).toEqual("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(programmeResult.userId).toEqual("userId")
      expect(programmeResult.nomProgramme).toEqual("nomProgramme")
    })
  })
})