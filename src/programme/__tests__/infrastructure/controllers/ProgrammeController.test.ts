import { describe, expect, it } from "vitest"

import { ProgrammeRepository } from "../../../infrastructure/adapters/ProgrammeRepository"
import { ProgrammeController } from "../../../infrastructure/controllers/ProgrammeController"
import { container } from "api"

describe("ProgrammeController", () => {
  let programmeController: ProgrammeController
  let programmeRepository: ProgrammeRepository

  beforeEach(() => {
    programmeController = container.resolve("programmeController")
    programmeRepository = container.resolve("programmeRepository")
  })

  describe("Créer un nouveau programme", () => {
    describe("Quand tout est OK", () => {
      it("doit créer un programme", async () => {
        // Act
        await programmeController.creerProgramme("userId", "nomProgramme")
        // Assert
        const listeDeProgrammes = await programmeRepository.recupererTout()

        expect(listeDeProgrammes).toHaveLength(1)

        expect(listeDeProgrammes.at(0)?.userId).toEqual("userId")
        expect(listeDeProgrammes.at(0)?.nomProgramme).toEqual("nomProgramme")
      })
    })
  })
})