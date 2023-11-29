import { describe, expect, it } from "vitest"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
import type { Seance } from "../../../domain/Seance"
import { PrismaSeanceRepository } from "../../../infrastructure/adapters/PrismaSeanceRepository"
import { prisma } from "~/server/db/prisma"
import { SeanceBuilder } from "~/server/testUtils/builders/SeanceBuilder"

describe("PrismaSeanceRepository", () => {
  let prismaSeanceRepository: PrismaSeanceRepository
  beforeEach(() => {
    prismaSeanceRepository = new PrismaSeanceRepository()
  })

  describe("#creerSeance", () => {
    it(
      "doit creer un seance",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidSeance = testIdGenerator.getId()
        const seance: Seance = new SeanceBuilder().withId(uuidSeance).build()
        // Act
        await prismaSeanceRepository.creerSeance(seance)
        // Assert
        const seanceResult = await prismaSeanceRepository.recupererParId(uuidSeance)
        expect(seanceResult).toBeDefined()
        expect(seanceResult?.id).toEqual(uuidSeance)
        expect(seanceResult?.idUtilisateur).toEqual("idUtilisateur")
        expect(seanceResult?.nomSeance).toEqual("nomSeance")
      })
    )
  })

  describe("#ajouterExerciceSeanceASeance", () => {
    it(
      "doit ajouter l'exercice à la séance",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidExerciceSeance = testIdGenerator.getId()
        const uuidSeance = testIdGenerator.getId()
        const uuidExerciceSeanceAAjouter = testIdGenerator.getId()

        const exerciceSeance = new ExerciceSeanceBuilder()
          .withId(uuidExerciceSeance)
          .withOrdre(1)
          .build()
        const exerciceSeanceAAjouter = new ExerciceSeanceBuilder()
          .withId(uuidExerciceSeanceAAjouter)
          .withOrdre(2)
          .build()
        const seance: Seance = new SeanceBuilder().withId(uuidSeance).withListeExerciceSeance(exerciceSeance).build()
        await prismaSeanceRepository.creerSeance(seance)
        // Act
        await prismaSeanceRepository.ajouterExerciceSeanceASeance(uuidSeance, exerciceSeance)
        await prismaSeanceRepository.ajouterExerciceSeanceASeance(uuidSeance, exerciceSeanceAAjouter)
        // Assert
        const seanceResult = await prismaSeanceRepository.recupererParId(uuidSeance)
        expect(seanceResult.exerciceSeances).toHaveLength(2)
        expect(seanceResult.exerciceSeances.at(0)?.ordre).toEqual(1)
        expect(seanceResult.exerciceSeances.at(1)?.ordre).toEqual(2)
      })
    )
  })

  describe("#modifierNomSeance", () => {
    it(
      "doit mettre à jour le nom de la séance",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidSeance = testIdGenerator.getId()
        const seance1: Seance = new SeanceBuilder().withId(uuidSeance).withNomSeance("nom Seance").build()
        await prismaSeanceRepository.creerSeance(seance1)
        // Act
        await prismaSeanceRepository.modifierNomSeance(uuidSeance, "nouveau nom séance")
        // Assert
        const seanceMiseAJour = await prisma.seance.findUnique({ where: { id: uuidSeance } })
        expect(seanceMiseAJour?.nomSeance).toEqual("nouveau nom séance")
      })
    )
  })
})
