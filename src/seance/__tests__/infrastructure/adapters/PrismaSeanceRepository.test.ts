import { describe, expect, it } from "vitest"

import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
import { Seance } from "../../../domain/Seance"
import { PrismaSeanceRepository } from "../../../infrastructure/adapters/PrismaSeanceRepository"
import { prisma } from "api/db/prisma";
import { SeanceBuilder } from "api/testUtils/builders/SeanceBuilder"

describe("PrismaSeanceRepository", () => {
  let prismaSeanceRepository: PrismaSeanceRepository
  beforeEach(() => {
    prismaSeanceRepository = new PrismaSeanceRepository()
  })

  describe("#creerSeance", () => {
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

  describe("#ajouterExerciceSeanceASeance", () => {
    it("doit ajouter l'exercice à la séance", async () => {
      // Arrange
      const exerciceSeance = new ExerciceSeanceBuilder()
        .withId("71cf915d-7b8b-4f02-b993-9e268dc949b0")
        .withOrdre(1)
        .withTempsRepos(45)
        .build()
      const exerciceSeanceAAjouter = new ExerciceSeanceBuilder()
        .withId("4608d616-43d3-47b9-99a6-2ebc830b58af")
        .withOrdre(2)
        .withTempsRepos(55)
        .build()
      const seance: Seance = new SeanceBuilder()
        .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
        .withListeExerciceSeance(exerciceSeance)
        .build()
      await prismaSeanceRepository.creerSeance(seance)
      // Act
      await prismaSeanceRepository.ajouterExerciceSeanceASeance("54d9eb29-5410-4428-936f-9d252799e4ce", exerciceSeance)
      await prismaSeanceRepository.ajouterExerciceSeanceASeance("54d9eb29-5410-4428-936f-9d252799e4ce", exerciceSeanceAAjouter)
      // Assert
      const seanceResult = await prismaSeanceRepository.recupererParId("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(seanceResult.exerciceSeances).toHaveLength(2)
      expect(seanceResult.exerciceSeances.at(0)?.ordre).toEqual(1)
      expect(seanceResult.exerciceSeances.at(0)?.tempsRepos).toEqual(45)
      expect(seanceResult.exerciceSeances.at(1)?.ordre).toEqual(2)
      expect(seanceResult.exerciceSeances.at(1)?.tempsRepos).toEqual(55)
    })
  })

  describe("#modifierNomSeance", () => {
    it("doit mettre à jour le nom de la séance", async () => {
      // Arrange
      const seance1: Seance = new SeanceBuilder()
        .withId("fcf88475-e6d8-4062-9aa4-10411c1b15b5")
        .withNomSeance("nom Seance")
        .build()
      await prismaSeanceRepository.creerSeance(seance1)
      // Act
      await prismaSeanceRepository.modifierNomSeance("fcf88475-e6d8-4062-9aa4-10411c1b15b5", "nouveau nom séance")
      // Assert
      const seanceMiseAJour = await prisma.seance.findUnique({ where: { id: "fcf88475-e6d8-4062-9aa4-10411c1b15b5"}})
      expect(seanceMiseAJour?.nomSeance).toEqual("nouveau nom séance")
    })
  })
})
