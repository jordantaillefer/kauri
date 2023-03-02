import { describe, expect, it } from "vitest"

import { ExerciceBuilder } from "../../../../testUtils/builders/ExerciceBuilder"
import { Exercice } from "../../../domain/Exercice"
import { CATEGORIE } from "../../../domain/categorie"
import { PrismaExerciceRepository } from "../../../infrastructure/adapters/PrismaExerciceRepository"

describe("PrismaExerciceRepository", () => {
  let prismaExerciceRepository: PrismaExerciceRepository
  beforeEach(() => {
    prismaExerciceRepository = new PrismaExerciceRepository()
  })

  describe("recupererTout", () => {
    it("quand il n'existe aucun exercice, remonte un tableau vide", async () => {
      // Act
      const listeExerciceResult = await prismaExerciceRepository.recupererTout()
      // Assert
      expect(listeExerciceResult).toHaveLength(0)
    })
    it("quand il existe des exercices, remonte le tableau des exercices", async () => {
      // Arrange
      const seance1: Exercice = new ExerciceBuilder()
        .withId("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
        .withNomExercice("Exercice 1")
        .withCategorie(CATEGORIE.ABDOMINAUX)
        .build()
      const seance2: Exercice = new ExerciceBuilder()
        .withId("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
        .withNomExercice("Exercice 2")
        .withCategorie(CATEGORIE.BICEPS)
        .build()
      await prismaExerciceRepository.creerExercice(seance1)
      await prismaExerciceRepository.creerExercice(seance2)

      // Act
      const listeExerciceResult = await prismaExerciceRepository.recupererTout()
      // Assert
      expect(listeExerciceResult).toHaveLength(2)
      expect(listeExerciceResult.at(0)?.id).toEqual("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
      expect(listeExerciceResult.at(0)?.nomExercice).toEqual("Exercice 1")
      expect(listeExerciceResult.at(0)?.categorie).toEqual(CATEGORIE.ABDOMINAUX)
      expect(listeExerciceResult.at(1)?.id).toEqual("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
      expect(listeExerciceResult.at(1)?.nomExercice).toEqual("Exercice 2")
      expect(listeExerciceResult.at(1)?.categorie).toEqual(CATEGORIE.BICEPS)
    })
  })
})
