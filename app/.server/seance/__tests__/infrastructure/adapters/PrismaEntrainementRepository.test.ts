import { describe, expect, it } from "vitest"
import { anyString } from "vitest-mock-extended"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import { EntrainementBuilder } from "../../../application/EntrainementBuilder"
import { ExerciceEntrainementBuilder } from "../../../application/builders/ExerciceEntrainementBuilder"
import { SerieEntrainementBuilder } from "../../../application/builders/SerieEntrainementBuilder"
import { PrismaEntrainementRepository } from "../../../infrastructure/adapters/PrismaEntrainementRepository"
import { prisma } from "~/.server/db/prisma"
import { CATEGORIE } from "~/.server/exercice/domain/categorie"
import { getContainer } from "@/api/index.server"

describe("PrismaEntrainementRepository", () => {
  describe("#creerEntrainement", () => {
    it(
      "doit sauvegarder l'entrainement",
      integrationTestFunction(async ({ testIdGenerator, container }) => {
        // Arrange
        const prismaEntrainementRepository = new PrismaEntrainementRepository({
          correlationIdService: container.resolve('correlationIdService')
        })
        const uuidSerieEntrainement1 = testIdGenerator.getId()
        const uuidSerieEntrainement2 = testIdGenerator.getId()
        const uuidSerieEntrainement3 = testIdGenerator.getId()
        const uuidExerciceEntrainement1 = testIdGenerator.getId()
        const uuidExerciceEntrainement2 = testIdGenerator.getId()
        const uuidEntrainement = testIdGenerator.getId()
        const uuidUtilisateur = testIdGenerator.getId()

        const serieEntrainement1 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement1)
          .withNombreRepetition(8)
          .withPoids(10)
          .withOrdre(1)
          .withEstRealise(false)
          .build()
        const serieEntrainement2 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement2)
          .withNombreRepetition(10)
          .withPoids(15)
          .withOrdre(1)
          .withEstRealise(true)
          .build()
        const serieEntrainement3 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement3)
          .withNombreRepetition(12)
          .withPoids(20)
          .withOrdre(2)
          .withEstRealise(false)
          .build()
        const exerciceEntrainement1 = new ExerciceEntrainementBuilder()
          .withId(uuidExerciceEntrainement1)
          .withEstRealise(false)
          .withNomExercice("nomExercice 1")
          .withOrdre(1)
          .withCategorie(CATEGORIE.PECTORAUX)
          .withListeSerieEntrainement(serieEntrainement1)
          .build()
        const exerciceEntrainement2 = new ExerciceEntrainementBuilder()
          .withId(uuidExerciceEntrainement2)
          .withEstRealise(true)
          .withNomExercice("nomExercice 2")
          .withOrdre(2)
          .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
          .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
          .build()
        const entrainement = new EntrainementBuilder()
          .withId(uuidEntrainement)
          .withIdUtilisateur(uuidUtilisateur)
          .withNomSeance("nomSeance")
          .withListeExerciceEntrainement(exerciceEntrainement1, exerciceEntrainement2)
          .build()

        // Act
        await prismaEntrainementRepository.creerEntrainement(entrainement)

        // Assert
        const nouvelEntrainement = await prisma.entrainement.findUnique({
          where: { id: uuidEntrainement },
          include: {
            exerciceEntrainements: {
              orderBy: { ordre: "asc" },
              include: {
                serieEntrainements: { orderBy: { ordre: "asc" } }
              }
            }
          }
        })

        expect(nouvelEntrainement?.idUtilisateur).toEqual(uuidUtilisateur)
        expect(nouvelEntrainement?.nomSeance).toEqual("nomSeance")
        expect(nouvelEntrainement?.exerciceEntrainements).toHaveLength(2)
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.id).toMatchObject(anyString())
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.estRealise).toEqual(false)
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.nomExercice).toEqual("nomExercice 1")
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.categorie).toEqual("Pectoraux")
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.ordre).toEqual(1)
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.serieEntrainements).toHaveLength(1)
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.serieEntrainements.at(0)?.id).toBeDefined()
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.serieEntrainements.at(0)?.nombreRepetition).toEqual(8)
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.serieEntrainements.at(0)?.poids).toEqual(10)
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.serieEntrainements.at(0)?.ordre).toEqual(1)
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.serieEntrainements.at(0)?.estRealise).toEqual(false)

        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.id).toEqual(uuidExerciceEntrainement2)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.estRealise).toEqual(true)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.nomExercice).toEqual("nomExercice 2")
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.categorie).toEqual("Ischio-jambiers")
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.ordre).toEqual(2)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements).toHaveLength(2)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(0)?.id).toBeDefined()
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(0)?.nombreRepetition).toEqual(10)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(0)?.poids).toEqual(15)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(0)?.ordre).toEqual(1)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(0)?.estRealise).toEqual(true)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(1)?.id).toBeDefined()
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(1)?.nombreRepetition).toEqual(12)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(1)?.poids).toEqual(20)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(1)?.ordre).toEqual(2)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(1)?.estRealise).toEqual(false)
      })
    )
  })

  describe("#mettreAJourSerieEstRealise", () => {
    it(
      "doit mettre à jour le champ est réalisé de la série",
      integrationTestFunction(async ({ testIdGenerator, container }) => {
        // Arrange
        const prismaEntrainementRepository = new PrismaEntrainementRepository({
          correlationIdService: container.resolve('correlationIdService')
        })
        const uuidSerieEntrainement1 = testIdGenerator.getId()
        const uuidSerieEntrainement2 = testIdGenerator.getId()
        const uuidSerieEntrainement3 = testIdGenerator.getId()
        const uuidExerciceEntrainement1 = testIdGenerator.getId()
        const uuidExerciceEntrainement2 = testIdGenerator.getId()
        const uuidEntrainement = testIdGenerator.getId()

        const serieEntrainement1 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement1)
          .withNombreRepetition(8)
          .withOrdre(1)
          .withEstRealise(false)
          .build()
        const serieEntrainement2 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement2)
          .withNombreRepetition(10)
          .withOrdre(2)
          .withEstRealise(true)
          .build()
        const serieEntrainement3 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement3)
          .withNombreRepetition(12)
          .withOrdre(3)
          .withEstRealise(false)
          .build()
        const exerciceEntrainement1 = new ExerciceEntrainementBuilder()
          .withId(uuidExerciceEntrainement1)
          .withEstRealise(false)
          .withNomExercice("nomExercice 1")
          .withCategorie(CATEGORIE.PECTORAUX)
          .withOrdre(1)
          .withListeSerieEntrainement(serieEntrainement1)
          .build()
        const exerciceEntrainement2 = new ExerciceEntrainementBuilder()
          .withId(uuidExerciceEntrainement2)
          .withEstRealise(true)
          .withNomExercice("nomExercice 2")
          .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
          .withOrdre(2)
          .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
          .build()
        const entrainement = new EntrainementBuilder()
          .withId(uuidEntrainement)
          .withNomSeance("nomSeance")
          .withListeExerciceEntrainement(exerciceEntrainement1, exerciceEntrainement2)
          .build()
        await prismaEntrainementRepository.creerEntrainement(entrainement)

        // Act
        await prismaEntrainementRepository.mettreAJourSerieEstRealise(uuidSerieEntrainement1, true)
        // Assert
        const nouvelEntrainement = await prisma.entrainement.findUnique({
          where: { id: uuidEntrainement },
          include: {
            exerciceEntrainements: {
              orderBy: { ordre: "asc" },
              include: {
                serieEntrainements: { orderBy: { ordre: "asc" } }
              }
            }
          }
        })

        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.serieEntrainements.at(0)?.nombreRepetition).toEqual(8)
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.serieEntrainements.at(0)?.estRealise).toEqual(true)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(0)?.nombreRepetition).toEqual(10)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(0)?.estRealise).toEqual(true)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(1)?.nombreRepetition).toEqual(12)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(1)?.estRealise).toEqual(false)
      })
    )
  })

  describe("#mettreAJourExercice", () => {
    it(
      "doit mettre à jour le champ est réalisé de la série",
      integrationTestFunction(async ({ testIdGenerator, container }) => {
        // Arrange
        const prismaEntrainementRepository = new PrismaEntrainementRepository({
          correlationIdService: container.resolve('correlationIdService')
        })
        const uuidSerieEntrainement1 = testIdGenerator.getId()
        const uuidSerieEntrainement2 = testIdGenerator.getId()
        const uuidSerieEntrainement3 = testIdGenerator.getId()
        const uuidExerciceEntrainement1 = testIdGenerator.getId()
        const uuidExerciceEntrainement2 = testIdGenerator.getId()
        const uuidEntrainement = testIdGenerator.getId()

        const serieEntrainement1 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement1)
          .withNombreRepetition(8)
          .withEstRealise(false)
          .withOrdre(1)
          .build()
        const serieEntrainement2 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement2)
          .withNombreRepetition(10)
          .withEstRealise(true)
          .withOrdre(1)
          .build()
        const serieEntrainement3 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement3)
          .withNombreRepetition(12)
          .withEstRealise(false)
          .withOrdre(2)
          .build()
        const exerciceEntrainement1 = new ExerciceEntrainementBuilder()
          .withId(uuidExerciceEntrainement1)
          .withEstRealise(false)
          .withOrdre(1)
          .withListeSerieEntrainement(serieEntrainement1)
          .build()
        const exerciceEntrainement2 = new ExerciceEntrainementBuilder()
          .withId(uuidExerciceEntrainement2)
          .withEstRealise(true)
          .withOrdre(2)
          .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
          .build()
        const entrainement = new EntrainementBuilder()
          .withId(uuidEntrainement)
          .withListeExerciceEntrainement(exerciceEntrainement1, exerciceEntrainement2)
          .build()
        await prismaEntrainementRepository.creerEntrainement(entrainement)
        exerciceEntrainement1.mettreAJourSerieEstRealise(uuidSerieEntrainement1, true)

        // Act
        await prismaEntrainementRepository.mettreAJourExercice(exerciceEntrainement1)
        // Assert
        const nouvelEntrainement = await prisma.entrainement.findUnique({
          where: { id: uuidEntrainement },
          include: {
            exerciceEntrainements: {
              orderBy: { ordre: "asc" },
              include: {
                serieEntrainements: { orderBy: { ordre: "asc" } }
              }
            }
          }
        })
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.serieEntrainements.at(0)?.nombreRepetition).toEqual(8)
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.serieEntrainements.at(0)?.estRealise).toEqual(true)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(0)?.nombreRepetition).toEqual(10)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(0)?.estRealise).toEqual(true)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(1)?.nombreRepetition).toEqual(12)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.serieEntrainements.at(1)?.estRealise).toEqual(false)
      })
    )

    it(
      "doit mettre à jour le champ est réalisé de l'entrainement",
      integrationTestFunction(async ({ testIdGenerator, container }) => {
        // Arrange
        const prismaEntrainementRepository = new PrismaEntrainementRepository({
          correlationIdService: container.resolve('correlationIdService')
        })
        const uuidSerieEntrainement1 = testIdGenerator.getId()
        const uuidSerieEntrainement2 = testIdGenerator.getId()
        const uuidSerieEntrainement3 = testIdGenerator.getId()
        const uuidExerciceEntrainement1 = testIdGenerator.getId()
        const uuidExerciceEntrainement2 = testIdGenerator.getId()
        const uuidEntrainement = testIdGenerator.getId()

        const serieEntrainement1 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement1)
          .withNombreRepetition(8)
          .withEstRealise(true)
          .withOrdre(1)
          .build()
        const serieEntrainement2 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement2)
          .withNombreRepetition(10)
          .withEstRealise(true)
          .withOrdre(1)
          .build()
        const serieEntrainement3 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement3)
          .withNombreRepetition(12)
          .withEstRealise(true)
          .withOrdre(2)
          .build()
        const exerciceSeance1 = new ExerciceEntrainementBuilder()
          .withId(uuidExerciceEntrainement1)
          .withEstRealise(false)
          .withOrdre(1)
          .withListeSerieEntrainement(serieEntrainement1)
          .build()
        const exerciceSeance2 = new ExerciceEntrainementBuilder()
          .withId(uuidExerciceEntrainement2)
          .withEstRealise(true)
          .withOrdre(2)
          .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
          .build()
        const entrainement = new EntrainementBuilder()
          .withId(uuidEntrainement)
          .withListeExerciceEntrainement(exerciceSeance1, exerciceSeance2)
          .build()
        await prismaEntrainementRepository.creerEntrainement(entrainement)
        exerciceSeance1.mettreAJourEstRealise()

        // Act
        await prismaEntrainementRepository.mettreAJourExercice(exerciceSeance1)

        // Assert
        const nouvelEntrainement = await prisma.entrainement.findUnique({
          where: { id: uuidEntrainement },
          include: {
            exerciceEntrainements: {
              orderBy: { ordre: "asc" },
              include: {
                serieEntrainements: { orderBy: { ordre: "asc" } }
              }
            }
          }
        })
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.estRealise).toEqual(true)
      })
    )
  })

  describe("#mettreAJourEntrainementEstRealise", () => {
    it(
      "doit mettre à jour le champ est réalisé de l'entrainement",
      integrationTestFunction(async ({ testIdGenerator, container }) => {
        // Arrange
        const prismaEntrainementRepository = new PrismaEntrainementRepository({
          correlationIdService: container.resolve('correlationIdService')
        })
        const uuidSerieEntrainement1 = testIdGenerator.getId()
        const uuidSerieEntrainement2 = testIdGenerator.getId()
        const uuidSerieEntrainement3 = testIdGenerator.getId()
        const uuidExerciceEntrainement1 = testIdGenerator.getId()
        const uuidExerciceEntrainement2 = testIdGenerator.getId()
        const uuidEntrainement = testIdGenerator.getId()

        const serieEntrainement1 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement1)
          .withNombreRepetition(8)
          .withOrdre(1)
          .withEstRealise(false)
          .build()
        const serieEntrainement2 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement2)
          .withNombreRepetition(10)
          .withOrdre(1)
          .withEstRealise(true)
          .build()
        const serieEntrainement3 = new SerieEntrainementBuilder()
          .withId(uuidSerieEntrainement3)
          .withNombreRepetition(12)
          .withOrdre(2)
          .withEstRealise(false)
          .build()
        const exerciceEntrainement1 = new ExerciceEntrainementBuilder()
          .withId(uuidExerciceEntrainement1)
          .withEstRealise(false)
          .withNomExercice("nomExercice 1")
          .withOrdre(1)
          .withCategorie(CATEGORIE.PECTORAUX)
          .withListeSerieEntrainement(serieEntrainement1)
          .build()
        const exerciceEntrainement2 = new ExerciceEntrainementBuilder()
          .withId(uuidExerciceEntrainement2)
          .withEstRealise(false)
          .withNomExercice("nomExercice 2")
          .withOrdre(2)
          .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
          .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
          .build()
        const entrainement = new EntrainementBuilder()
          .withId(uuidEntrainement)
          .withNomSeance("nomSeance")
          .withListeExerciceEntrainement(exerciceEntrainement1, exerciceEntrainement2)
          .build()
        await prismaEntrainementRepository.creerEntrainement(entrainement)

        // Act
        await prismaEntrainementRepository.mettreAJourExerciceEstRealise(uuidExerciceEntrainement1, true)
        // Assert
        const nouvelEntrainement = await prisma.entrainement.findUnique({
          where: { id: uuidEntrainement },
          include: {
            exerciceEntrainements: {
              orderBy: { ordre: "asc" },
              include: {
                serieEntrainements: { orderBy: { ordre: "asc" } }
              }
            }
          }
        })

        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.nomExercice).toEqual("nomExercice 1")
        expect(nouvelEntrainement?.exerciceEntrainements.at(0)?.estRealise).toEqual(true)
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.nomExercice).toEqual("nomExercice 2")
        expect(nouvelEntrainement?.exerciceEntrainements.at(1)?.estRealise).toEqual(false)
      })
    )
  })
})
