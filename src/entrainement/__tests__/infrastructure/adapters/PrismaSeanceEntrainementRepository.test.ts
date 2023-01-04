import { describe, expect, it } from "vitest"

import { ProgrammeBuilder } from "../../../../testUtils/builders/ProgrammeBuilder"
import { SeanceEntrainementBuilder } from "../../../../testUtils/builders/SeanceEntrainementBuilder"
import { SeanceEntrainement } from "../../../domain/SeanceEntrainement"
import { PrismaProgrammeRepository } from "../../../infrastructure/adapters/PrismaProgrammeRepository"
import { PrismaSeanceEntrainementRepository } from "../../../infrastructure/adapters/PrismaSeanceEntrainementRepository"
import { random } from "nanoid"

describe("SeanceEntrainementRepository", () => {
  describe("creerSeanceEntrainement", () => {
    it("doit enregistrer la séance pour le programme donné", async () => {
      // Arrange
      const prismaProgrammeRepository = new PrismaProgrammeRepository()
      const prismaSeanceEntrainementRepository = new PrismaSeanceEntrainementRepository()

      const idProgramme = "be08f032-4269-460d-a8e5-8d8e2043d344"
      const programme = new ProgrammeBuilder().withId(idProgramme).build()
      await prismaProgrammeRepository.creerProgramme(programme)
      
      const seanceEntrainement = SeanceEntrainement.creerSeanceEntrainement({
        id: "f81d74a5-e93b-4e4c-8d4d-69b89654ffe1",
      })

      // Act
      await prismaSeanceEntrainementRepository.creerSeanceEntrainement(idProgramme, seanceEntrainement)

      // Assert
      const listeSeanceEntrainementParProgramme = await prismaSeanceEntrainementRepository.recupererToutParIdProgramme(idProgramme)
      expect(listeSeanceEntrainementParProgramme).toHaveLength(1)
      expect(listeSeanceEntrainementParProgramme.at(0)?.id).toEqual("f81d74a5-e93b-4e4c-8d4d-69b89654ffe1")
    })
    it("si le programme possède déjà une séance, doit ajouter la séance à la liste", async () => {
      // Arrange
      const prismaProgrammeRepository = new PrismaProgrammeRepository()
      const prismaSeanceEntrainementRepository = new PrismaSeanceEntrainementRepository()

      const idProgramme = "be08f032-4269-460d-a8e5-8d8e2043d344"
      const seanceEntrainementDejaPresente = new SeanceEntrainementBuilder().build()
      const programme = new ProgrammeBuilder().withId(idProgramme).withSeancesEntrainement(seanceEntrainementDejaPresente).build()
      await prismaProgrammeRepository.creerProgramme(programme)

      const nouvelleSeanceEntrainement = SeanceEntrainement.creerSeanceEntrainement({
        id: "f81d74a5-e93b-4e4c-8d4d-69b89654ffe1",
      })

      // Act
      await prismaSeanceEntrainementRepository.creerSeanceEntrainement(idProgramme, nouvelleSeanceEntrainement)

      // Assert
      const listeSeanceEntrainementParProgramme = await prismaSeanceEntrainementRepository.recupererToutParIdProgramme(idProgramme)
      expect(listeSeanceEntrainementParProgramme).toHaveLength(2)
      expect(listeSeanceEntrainementParProgramme.at(1)?.id).toEqual("f81d74a5-e93b-4e4c-8d4d-69b89654ffe1")
    })
  })

  describe("recupererToutParIdProgramme", () => {
    it("doit récuperer les séances d'entrainement associé a un programme", async () => {
      // Arrange
      const programme1 = new ProgrammeBuilder()
        .withId("59aafaf0-8932-4749-912f-3015e16b70c4")
        .withSeancesEntrainement(
          new SeanceEntrainementBuilder()
            .withId("ddd4b28d-3a6b-4a88-b0f1-51c884ac7c14")
            .build(),
          new SeanceEntrainementBuilder()
            .withId("0e37e050-dda7-4219-8f69-16f020be445a")
            .build(),
        )
        .build()
      const programme2 = new ProgrammeBuilder()
        .withId("fcde2c6d-3787-4c33-9731-ba1e91f2d710")
        .withSeancesEntrainement(
          new SeanceEntrainementBuilder()
            .withId("e5141ecd-80ed-4fa0-b884-56b75e7e4f52")
            .build()
        )
        .build()
      const prismaProgrammeRepository = new PrismaProgrammeRepository()
      const prismaSeanceEntrainementRepository = new PrismaSeanceEntrainementRepository()
      await prismaProgrammeRepository.creerProgramme(programme1)
      await prismaProgrammeRepository.creerProgramme(programme2)
      // Act
      const listeSeanceEntrainement = await prismaSeanceEntrainementRepository.recupererToutParIdProgramme("59aafaf0-8932-4749-912f-3015e16b70c4")
      // Assert
      expect(listeSeanceEntrainement).toHaveLength(2)
      expect(listeSeanceEntrainement.at(0)?.id).toEqual("ddd4b28d-3a6b-4a88-b0f1-51c884ac7c14")
      expect(listeSeanceEntrainement.at(1)?.id).toEqual("0e37e050-dda7-4219-8f69-16f020be445a")
    })
  })

  describe("supprimerSeanceEntrainement", () => {
    it("doit supprimer la seance d'entrainement", async () => {
      // Arrange
      const programme1 = new ProgrammeBuilder()
        .withId("59aafaf0-8932-4749-912f-3015e16b70c4")
        .withSeancesEntrainement(
          new SeanceEntrainementBuilder()
            .withId("ddd4b28d-3a6b-4a88-b0f1-51c884ac7c14")
            .build(),
          new SeanceEntrainementBuilder()
            .withId("0e37e050-dda7-4219-8f69-16f020be445a")
            .build(),
        )
        .build()
      const programme2 = new ProgrammeBuilder()
        .withId("fcde2c6d-3787-4c33-9731-ba1e91f2d710")
        .withSeancesEntrainement(
          new SeanceEntrainementBuilder()
            .withId("e5141ecd-80ed-4fa0-b884-56b75e7e4f52")
            .build()
        )
        .build()
      const prismaProgrammeRepository = new PrismaProgrammeRepository()
      const prismaSeanceEntrainementRepository = new PrismaSeanceEntrainementRepository()
      await prismaProgrammeRepository.creerProgramme(programme1)
      await prismaProgrammeRepository.creerProgramme(programme2)

      // Act
      await prismaSeanceEntrainementRepository.supprimerSeanceEntrainement("0e37e050-dda7-4219-8f69-16f020be445a")
      // Assert
      const listeSeanceEntrainement = await prismaSeanceEntrainementRepository.recupererToutParIdProgramme("59aafaf0-8932-4749-912f-3015e16b70c4")

      expect(listeSeanceEntrainement).toHaveLength(1)
      expect(listeSeanceEntrainement.at(0)?.id).toEqual("ddd4b28d-3a6b-4a88-b0f1-51c884ac7c14")
    })
    it("doit pas remonter une erreur si la seance d'entrainement n'existe pas", async () => {
      const programme1 = new ProgrammeBuilder()
        .withId("59aafaf0-8932-4749-912f-3015e16b70c4")
        .withSeancesEntrainement(
          new SeanceEntrainementBuilder()
            .withId("ddd4b28d-3a6b-4a88-b0f1-51c884ac7c14")
            .build(),
          new SeanceEntrainementBuilder()
            .withId("0e37e050-dda7-4219-8f69-16f020be445a")
            .build(),
        )
        .build()
      const programme2 = new ProgrammeBuilder()
        .withId("fcde2c6d-3787-4c33-9731-ba1e91f2d710")
        .withSeancesEntrainement(
          new SeanceEntrainementBuilder()
            .withId("e5141ecd-80ed-4fa0-b884-56b75e7e4f52")
            .build()
        )
        .build()
      const prismaProgrammeRepository = new PrismaProgrammeRepository()
      const prismaSeanceEntrainementRepository = new PrismaSeanceEntrainementRepository()
      await prismaProgrammeRepository.creerProgramme(programme1)
      await prismaProgrammeRepository.creerProgramme(programme2)

      // Act
      await prismaSeanceEntrainementRepository.supprimerSeanceEntrainement("id qui n'existe pas")
      // Assert
      expect(true).toBe(true)
    })
  })
})