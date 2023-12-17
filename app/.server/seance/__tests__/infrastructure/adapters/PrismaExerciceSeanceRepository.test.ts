import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
import { SerieExerciceSeanceBuilder } from "../../../application/builders/SerieExerciceSeanceBuilder"
import type { ExerciceSeance } from "../../../domain/ExerciceSeance"
import type { Seance } from "../../../domain/Seance"
import { ExerciceSeanceNotFoundError } from "../../../domain/errors/ExerciceSeanceNotFoundError"
import { PrismaExerciceSeanceRepository } from "../../../infrastructure/adapters/PrismaExerciceSeanceRepository"
import { PrismaSeanceRepository } from "../../../infrastructure/adapters/PrismaSeanceRepository"
import { prisma } from "~/.server/db/prisma"
import { CATEGORIE } from "~/.server/exercice/domain/categorie"
import { SeanceBuilder } from "~/.server/testUtils/builders/SeanceBuilder"

describe("PrismaExerciceSeanceRepository", () => {
  let prismaExerciceSeanceRepository: PrismaExerciceSeanceRepository
  let prismaSeanceRepository: PrismaSeanceRepository

  beforeEach(() => {
    prismaExerciceSeanceRepository = new PrismaExerciceSeanceRepository()
    prismaSeanceRepository = new PrismaSeanceRepository()
  })

  describe("#creerExerciceSeance", () => {
    it(
      "doit créer l'exercice d'une séance",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidSeance = testIdGenerator.getId()
        const uuidExerciceSeance = testIdGenerator.getId()
        const uuidExercice = testIdGenerator.getId()

        const seance: Seance = new SeanceBuilder().withId(uuidSeance).withIdUtilisateur(testIdGenerator.getId()).build()
        await prismaSeanceRepository.creerSeance(seance)

        const exerciceSeance: ExerciceSeance = new ExerciceSeanceBuilder()
          .withId(uuidExerciceSeance)
          .withIdSeance(uuidSeance)
          .withIdExercice(uuidExercice)
          .withNomExercice("nomExercice")
          .withCategorie(CATEGORIE.ABDOMINAUX)
          .build()
        // Act

        await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)
        // Assert
        const listeExerciceSeanceResult = await prisma.exerciceSeance.findMany({
          where: {
            idSeance: uuidSeance
          }
        })
        expect(listeExerciceSeanceResult).toHaveLength(1)
        expect(listeExerciceSeanceResult.at(0)?.id).toEqual(uuidExerciceSeance)
        expect(listeExerciceSeanceResult.at(0)?.idSeance).toEqual(uuidSeance)
        expect(listeExerciceSeanceResult.at(0)?.idExercice).toEqual(uuidExercice)
        expect(listeExerciceSeanceResult.at(0)?.nomExercice).toEqual("nomExercice")
        expect(listeExerciceSeanceResult.at(0)?.categorie).toEqual(CATEGORIE.ABDOMINAUX)
      })
    )
  })

  describe("#modifierExerciceSeance", () => {
    it(
      "doit modifier l'exercice d'une séance",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidSeance = testIdGenerator.getId()
        const uuidExerciceSeance = testIdGenerator.getId()
        const uuidExercice = testIdGenerator.getId()
        const uuidExercice2 = testIdGenerator.getId()

        const seance: Seance = new SeanceBuilder().withId(uuidSeance).withIdUtilisateur(testIdGenerator.getId()).build()
        await prismaSeanceRepository.creerSeance(seance)

        const exerciceSeance: ExerciceSeance = new ExerciceSeanceBuilder()
          .withId(uuidExerciceSeance)
          .withIdSeance(uuidSeance)
          .withIdExercice(uuidExercice)
          .withNomExercice("nomExercice")
          .withCategorie(CATEGORIE.ABDOMINAUX)
          .build()
        await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)

        const exerciceSeanceModifie: ExerciceSeance = new ExerciceSeanceBuilder()
          .withId(uuidExerciceSeance)
          .withIdSeance(uuidSeance)
          .withIdExercice(uuidExercice2)
          .withNomExercice("nouveau nom exercice")
          .withCategorie(CATEGORIE.PECTORAUX)
          .build()
        // Act
        await prismaExerciceSeanceRepository.modifierExerciceSeance(exerciceSeanceModifie)

        // Assert
        const listeExerciceSeanceResult = await prisma.exerciceSeance.findMany({
          where: {
            idSeance: uuidSeance
          }
        })
        expect(listeExerciceSeanceResult).toHaveLength(1)
        expect(listeExerciceSeanceResult.at(0)?.id).toEqual(uuidExerciceSeance)
        expect(listeExerciceSeanceResult.at(0)?.idSeance).toEqual(uuidSeance)
        expect(listeExerciceSeanceResult.at(0)?.idExercice).toEqual(uuidExercice2)
        expect(listeExerciceSeanceResult.at(0)?.nomExercice).toEqual("nouveau nom exercice")
        expect(listeExerciceSeanceResult.at(0)?.categorie).toEqual(CATEGORIE.PECTORAUX)
      })
    )
  })

  describe("#recupererParIdEtParIdSeance", () => {
    it(
      "quand l'exercice existe, doit remonter l'exercice de la seance",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidSeance = testIdGenerator.getId()
        const uuidExerciceSeance = testIdGenerator.getId()
        const uuidExercice = testIdGenerator.getId()
        const seance: Seance = new SeanceBuilder().withId(uuidSeance).withIdUtilisateur(testIdGenerator.getId()).build()
        await prismaSeanceRepository.creerSeance(seance)

        const exerciceSeance: ExerciceSeance = new ExerciceSeanceBuilder()
          .withId(uuidExerciceSeance)
          .withIdSeance(uuidSeance)
          .withIdExercice(uuidExercice)
          .withNomExercice("nomExercice")
          .withCategorie(CATEGORIE.ABDOMINAUX)
          .build()
        await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)

        // Act
        const exerciceSeanceResult = await prismaExerciceSeanceRepository.recupererParIdSeanceEtParId(
          uuidSeance,
          uuidExerciceSeance
        )

        // Assert
        expect(exerciceSeanceResult).toBeDefined()
        expect(exerciceSeanceResult.id).toEqual(uuidExerciceSeance)
        expect(exerciceSeanceResult.idSeance).toEqual(uuidSeance)
        expect(exerciceSeanceResult.idExercice).toEqual(uuidExercice)
        expect(exerciceSeanceResult.nomExercice).toEqual("nomExercice")
        expect(exerciceSeanceResult.categorie).toEqual(CATEGORIE.ABDOMINAUX)
      })
    )
    it(
      "quand l'exercice n'existe pas, doit remonter une erreur",
      integrationTestFunction(async ({ testIdGenerator }) => {
        expect.assertions(2)
        try {
          // Act
          await prismaExerciceSeanceRepository.recupererParIdSeanceEtParId(
            testIdGenerator.getId(),
            testIdGenerator.getId()
          )
        } catch (error: unknown) {
          // Assert
          expect(error).toBeInstanceOf(ExerciceSeanceNotFoundError)
          expect((error as ExerciceSeanceNotFoundError).reasonPhrase).toEqual(ReasonPhrases.NOT_FOUND)
        }
      })
    )
    it(
      "quand l'exercice n'appartient pas à la séance, doit remonter une erreur",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidSeance = testIdGenerator.getId()
        const uuidSeance2 = testIdGenerator.getId()
        const uuidExerciceSeance = testIdGenerator.getId()

        expect.assertions(2)
        const seance1: Seance = new SeanceBuilder()
          .withId(uuidSeance)
          .withIdUtilisateur(testIdGenerator.getId())
          .build()
        await prismaSeanceRepository.creerSeance(seance1)
        const seance2: Seance = new SeanceBuilder().withId(uuidSeance2).withIdUtilisateur(testIdGenerator.getId()).build()
        await prismaSeanceRepository.creerSeance(seance2)

        const exerciceSeance: ExerciceSeance = new ExerciceSeanceBuilder()
          .withId(uuidExerciceSeance)
          .withIdSeance(uuidSeance)
          .withIdExercice(testIdGenerator.getId())
          .withNomExercice("nomExercice")
          .withCategorie(CATEGORIE.ABDOMINAUX)
          .build()
        await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)

        try {
          // Act
          await prismaExerciceSeanceRepository.recupererParIdSeanceEtParId(uuidSeance2, uuidExerciceSeance)
        } catch (error: unknown) {
          // Assert
          expect(error).toBeInstanceOf(ExerciceSeanceNotFoundError)
          expect((error as ExerciceSeanceNotFoundError).reasonPhrase).toEqual(ReasonPhrases.NOT_FOUND)
        }
      })
    )
  })

  describe("#ajouterSerieExerciceSeance", () => {
    it(
      "doit ajouter les series à un exercice de séance",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidSerieExerciceSeance1 = testIdGenerator.getId()
        const uuidSerieExerciceSeance2 = testIdGenerator.getId()
        const uuidSeance = testIdGenerator.getId()
        const uuidExerciceSeance = testIdGenerator.getId()

        const serieExerciceSeance1 = new SerieExerciceSeanceBuilder()
          .withId(uuidSerieExerciceSeance1)
          .withRepetitions(10)
          .withOrdre(1)
          .build()
        const serieExerciceSeance2 = new SerieExerciceSeanceBuilder()
          .withId(uuidSerieExerciceSeance2)
          .withRepetitions(12)
          .withOrdre(2)
          .build()
        const seance = new SeanceBuilder().withId(uuidSeance).withIdUtilisateur(testIdGenerator.getId()).build()
        const exerciceSeance = new ExerciceSeanceBuilder().withId(uuidExerciceSeance).withIdSeance(uuidSeance).build()
        await prismaSeanceRepository.creerSeance(seance)
        await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)
        exerciceSeance.definirSerie([serieExerciceSeance1, serieExerciceSeance2])
        // Act
        await prismaExerciceSeanceRepository.ajouterSerieExerciceSeance(exerciceSeance)
        // Assert
        const exerciceSeanceResult = await prismaExerciceSeanceRepository.recupererParIdSeanceEtParId(
          uuidSeance,
          uuidExerciceSeance
        )
        expect(exerciceSeanceResult.listeSerieExerciceSeance).toHaveLength(2)
        expect(exerciceSeanceResult.listeSerieExerciceSeance.at(0)?.repetitions).toEqual(10)
        expect(exerciceSeanceResult.listeSerieExerciceSeance.at(0)?.ordre).toEqual(1)
        expect(exerciceSeanceResult.listeSerieExerciceSeance.at(1)?.repetitions).toEqual(12)
        expect(exerciceSeanceResult.listeSerieExerciceSeance.at(1)?.ordre).toEqual(2)
      })
    )
  })

  describe("#supprimerSerieExerciceSeance", () => {
    it(
      "doit supprimer les series de l'exercice de séance",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidSerieExerciceSeance1 = testIdGenerator.getId()
        const uuidSerieExerciceSeance2 = testIdGenerator.getId()
        const uuidSeance = testIdGenerator.getId()
        const uuidExerciceSeance = testIdGenerator.getId()
        const serieExerciceSeance1 = new SerieExerciceSeanceBuilder()
          .withId(uuidSerieExerciceSeance1)
          .withRepetitions(10)
          .build()
        const serieExerciceSeance2 = new SerieExerciceSeanceBuilder()
          .withId(uuidSerieExerciceSeance2)
          .withRepetitions(12)
          .build()

        const seance = new SeanceBuilder().withId(uuidSeance).withIdUtilisateur(testIdGenerator.getId()).build()
        const exerciceSeance = new ExerciceSeanceBuilder().withId(uuidExerciceSeance).withIdSeance(uuidSeance).build()
        await prismaSeanceRepository.creerSeance(seance)
        await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)
        exerciceSeance.definirSerie([serieExerciceSeance1, serieExerciceSeance2])
        await prismaExerciceSeanceRepository.ajouterSerieExerciceSeance(exerciceSeance)
        // Act
        await prismaExerciceSeanceRepository.supprimerSerieExerciceSeance(uuidExerciceSeance)
        // Assert
        const exerciceSeanceResult = await prismaExerciceSeanceRepository.recupererParIdSeanceEtParId(
          uuidSeance,
          uuidExerciceSeance
        )
        expect(exerciceSeanceResult.listeSerieExerciceSeance).toHaveLength(0)
      })
    )
  })

  describe("#supprimerExerciceSeance", () => {
    it(
      "doit supprimer l'exercice de séance",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        expect.assertions(1)
        const uuidSerieExerciceSeance1 = testIdGenerator.getId()
        const uuidSerieExerciceSeance2 = testIdGenerator.getId()
        const uuidSeance = testIdGenerator.getId()
        const uuidExerciceSeance = testIdGenerator.getId()
        const serieExerciceSeance1 = new SerieExerciceSeanceBuilder()
          .withId(uuidSerieExerciceSeance1)
          .withRepetitions(10)
          .build()
        const serieExerciceSeance2 = new SerieExerciceSeanceBuilder()
          .withId(uuidSerieExerciceSeance2)
          .withRepetitions(12)
          .build()

        const seance = new SeanceBuilder().withId(uuidSeance).withIdUtilisateur(testIdGenerator.getId()).build()
        const exerciceSeance = new ExerciceSeanceBuilder().withId(uuidExerciceSeance).withIdSeance(uuidSeance).build()
        await prismaSeanceRepository.creerSeance(seance)
        await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)
        exerciceSeance.definirSerie([serieExerciceSeance1, serieExerciceSeance2])
        await prismaExerciceSeanceRepository.ajouterSerieExerciceSeance(exerciceSeance)
        // Act
        await prismaExerciceSeanceRepository.supprimerExerciceSeance(uuidExerciceSeance)
        // Assert
        try {
          await prismaExerciceSeanceRepository.recupererParIdSeanceEtParId(uuidSeance, uuidExerciceSeance)
        } catch (error: unknown) {
          expect(true).toEqual(true)
        }
      })
    )
  })
})
