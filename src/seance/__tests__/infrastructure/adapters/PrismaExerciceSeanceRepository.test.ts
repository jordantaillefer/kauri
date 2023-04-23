import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { prisma } from "../../../../db/prisma";
import { CATEGORIE } from "../../../../exercice/domain/categorie"
import { SeanceBuilder } from "../../../../testUtils/builders/SeanceBuilder"
import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
import { SerieExerciceSeanceBuilder } from "../../../application/builders/SerieExerciceSeanceBuilder"
import { ExerciceSeance } from "../../../domain/ExerciceSeance"
import { Seance } from "../../../domain/Seance"
import { ExerciceSeanceNotFoundError } from "../../../domain/errors/ExerciceSeanceNotFoundError"
import { PrismaExerciceSeanceRepository } from "../../../infrastructure/adapters/PrismaExerciceSeanceRepository"
import { PrismaSeanceRepository } from "../../../infrastructure/adapters/PrismaSeanceRepository"

describe("PrismaExerciceSeanceRepository", () => {
  let prismaExerciceSeanceRepository: PrismaExerciceSeanceRepository
  let prismaSeanceRepository: PrismaSeanceRepository

  beforeEach(() => {
    prismaExerciceSeanceRepository = new PrismaExerciceSeanceRepository()
    prismaSeanceRepository = new PrismaSeanceRepository()
  })

  describe("#creerExerciceSeance", () => {
    it("doit créer l'exercice d'une séance", async () => {
      // Arrange
      const seance: Seance = new SeanceBuilder()
        .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
        .build()
      await prismaSeanceRepository.creerSeance(seance)

      const exerciceSeance: ExerciceSeance = new ExerciceSeanceBuilder()
        .withId("5689ac30-8cb5-4bc8-9a6f-babd46668724")
        .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
        .withIdExercice("idExercice")
        .withNomExercice("nomExercice")
        .withTempsRepos(45)
        .withCategorie(CATEGORIE.ABDOMINAUX)
        .build()
      // Act

      await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)
      // Assert
      const listeExerciceSeanceResult = await prismaExerciceSeanceRepository.recupererTout()
      expect(listeExerciceSeanceResult).toHaveLength(1)
      expect(listeExerciceSeanceResult.at(0)?.id).toEqual("5689ac30-8cb5-4bc8-9a6f-babd46668724")
      expect(listeExerciceSeanceResult.at(0)?.idSeance).toEqual("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(listeExerciceSeanceResult.at(0)?.idExercice).toEqual("idExercice")
      expect(listeExerciceSeanceResult.at(0)?.nomExercice).toEqual("nomExercice")
      expect(listeExerciceSeanceResult.at(0)?.tempsRepos).toEqual(45)
      expect(listeExerciceSeanceResult.at(0)?.categorie).toEqual(CATEGORIE.ABDOMINAUX)
    })
  })

  describe("#recupererParIdEtParIdSeance", () => {
    it("quand l'exercice existe, doit remonter l'exercice de la seance", async () => {
      // Arrange
      const seance: Seance = new SeanceBuilder()
        .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
        .build()
      await prismaSeanceRepository.creerSeance(seance)

      const exerciceSeance: ExerciceSeance = new ExerciceSeanceBuilder()
        .withId("5689ac30-8cb5-4bc8-9a6f-babd46668724")
        .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
        .withIdExercice("idExercice")
        .withNomExercice("nomExercice")
        .withCategorie(CATEGORIE.ABDOMINAUX)
        .build()
      await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)

      // Act
      const exerciceSeanceResult = await prismaExerciceSeanceRepository.recupererParIdSeanceEtParId("54d9eb29-5410-4428-936f-9d252799e4ce", "5689ac30-8cb5-4bc8-9a6f-babd46668724")

      // Assert
      expect(exerciceSeanceResult).toBeDefined()
      expect(exerciceSeanceResult.id).toEqual("5689ac30-8cb5-4bc8-9a6f-babd46668724")
      expect(exerciceSeanceResult.idSeance).toEqual("54d9eb29-5410-4428-936f-9d252799e4ce")
      expect(exerciceSeanceResult.idExercice).toEqual("idExercice")
      expect(exerciceSeanceResult.nomExercice).toEqual("nomExercice")
      expect(exerciceSeanceResult.categorie).toEqual(CATEGORIE.ABDOMINAUX)
    })
    it("quand l'exercice n'existe pas, doit remonter une erreur", async () => {
      expect.assertions(2)
      try {
        // Act
        await prismaExerciceSeanceRepository.recupererParIdSeanceEtParId("5689ac30-8cb5-4bc8-9a6f-babd46668724", "5689ac30-8cb5-4bc8-9a6f-babd46668724")
      } catch (error: unknown) {
        // Assert
        expect(error).toBeInstanceOf(ExerciceSeanceNotFoundError)
        expect((error as ExerciceSeanceNotFoundError).reasonPhrase).toEqual(ReasonPhrases.NOT_FOUND)
      }
    })
    it("quand l'exercice n'appartient pas à la séance, doit remonter une erreur", async () => {
      // Arrange
      expect.assertions(2)
      const seance1: Seance = new SeanceBuilder()
        .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
        .build()
      await prismaSeanceRepository.creerSeance(seance1)
      const seance2: Seance = new SeanceBuilder()
        .withId("df16d1b8-87d3-4f2b-b153-9537a900991b")
        .build()
      await prismaSeanceRepository.creerSeance(seance2)

      const exerciceSeance: ExerciceSeance = new ExerciceSeanceBuilder()
        .withId("5689ac30-8cb5-4bc8-9a6f-babd46668724")
        .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
        .withIdExercice("idExercice")
        .withNomExercice("nomExercice")
        .withCategorie(CATEGORIE.ABDOMINAUX)
        .build()
      await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)

      try {
        // Act
        await prismaExerciceSeanceRepository.recupererParIdSeanceEtParId("df16d1b8-87d3-4f2b-b153-9537a900991b", "5689ac30-8cb5-4bc8-9a6f-babd46668724")
      } catch (error: unknown) {
        // Assert
        expect(error).toBeInstanceOf(ExerciceSeanceNotFoundError)
        expect((error as ExerciceSeanceNotFoundError).reasonPhrase).toEqual(ReasonPhrases.NOT_FOUND)
      }
    })
  })

  describe("#ajouterSerieExerciceSeance", () => {
    it("doit ajouter les series à un exercice de séance", async () => {
      // Arrange
      const serieExerciceSeance1 = new SerieExerciceSeanceBuilder()
        .withId("64c21170-565a-4ad0-a8d1-e8756f02aafb")
        .withRepetitions(10)
        .withOrdre(1)
        .build()
      const serieExerciceSeance2 = new SerieExerciceSeanceBuilder()
        .withId("58a7a312-74d6-4da0-bbd0-9bfe7a00ebf0")
        .withRepetitions(12)
        .withOrdre(2)
        .build()
      const seance = new SeanceBuilder()
        .withId("6bc42156-b946-4128-b605-3b180765738f")
        .build()
      const exerciceSeance = new ExerciceSeanceBuilder()
        .withId("0e2947f4-960d-4fa2-b3f4-3c1f63447527")
        .withIdSeance("6bc42156-b946-4128-b605-3b180765738f")
        .build()
      await prismaSeanceRepository.creerSeance(seance)
      await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)
      exerciceSeance.definirSerie([serieExerciceSeance1, serieExerciceSeance2])
      // Act
      await prismaExerciceSeanceRepository.ajouterSerieExerciceSeance(exerciceSeance)
      // Assert
      const exerciceSeanceResult = await prismaExerciceSeanceRepository.recupererParIdSeanceEtParId("6bc42156-b946-4128-b605-3b180765738f", "0e2947f4-960d-4fa2-b3f4-3c1f63447527")
      expect(exerciceSeanceResult.listeSerieExerciceSeance).toHaveLength(2)
      expect(exerciceSeanceResult.listeSerieExerciceSeance.at(0)?.repetitions).toEqual(10)
      expect(exerciceSeanceResult.listeSerieExerciceSeance.at(0)?.ordre).toEqual(1)
      expect(exerciceSeanceResult.listeSerieExerciceSeance.at(1)?.repetitions).toEqual(12)
      expect(exerciceSeanceResult.listeSerieExerciceSeance.at(1)?.ordre).toEqual(2)
    })
  })

  describe("#supprimerSerieExerciceSeance", () => {
    it("doit ajouter les series à un exercice de séance", async () => {
      // Arrange
      const serieExerciceSeance1 = new SerieExerciceSeanceBuilder()
        .withId("64c21170-565a-4ad0-a8d1-e8756f02aafb")
        .withRepetitions(10)
        .build()
      const serieExerciceSeance2 = new SerieExerciceSeanceBuilder()
        .withId("58a7a312-74d6-4da0-bbd0-9bfe7a00ebf0")
        .withRepetitions(12)
        .build()
      const seance = new SeanceBuilder()
        .withId("6bc42156-b946-4128-b605-3b180765738f")
        .build()
      const exerciceSeance = new ExerciceSeanceBuilder()
        .withId("0e2947f4-960d-4fa2-b3f4-3c1f63447527")
        .withIdSeance("6bc42156-b946-4128-b605-3b180765738f")
        .build()
      await prismaSeanceRepository.creerSeance(seance)
      await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)
      exerciceSeance.definirSerie([serieExerciceSeance1, serieExerciceSeance2])
      await prismaExerciceSeanceRepository.ajouterSerieExerciceSeance(exerciceSeance)
      // Act
      await prismaExerciceSeanceRepository.supprimerSerieExerciceSeance("0e2947f4-960d-4fa2-b3f4-3c1f63447527")
      // Assert
      const exerciceSeanceResult = await prismaExerciceSeanceRepository.recupererParIdSeanceEtParId("6bc42156-b946-4128-b605-3b180765738f", "0e2947f4-960d-4fa2-b3f4-3c1f63447527")
      expect(exerciceSeanceResult.listeSerieExerciceSeance).toHaveLength(0)
    })
  })

  describe("#mettreAJourTempsRepos", () => {
    it("doit mettre à jour le temps de repos d'un exercice d'une seance", async () => {
      // Arrange
      const seance: Seance = new SeanceBuilder()
        .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
        .build()
      await prismaSeanceRepository.creerSeance(seance)

      const exerciceSeance: ExerciceSeance = new ExerciceSeanceBuilder()
        .withId("5689ac30-8cb5-4bc8-9a6f-babd46668724")
        .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
        .withIdExercice("idExercice")
        .withNomExercice("nomExercice")
        .withTempsRepos(45)
        .withCategorie(CATEGORIE.ABDOMINAUX)
        .build()
      await prismaExerciceSeanceRepository.creerExerciceSeance(exerciceSeance)
      // Act
      await prismaExerciceSeanceRepository.mettreAJourTempsRepos("5689ac30-8cb5-4bc8-9a6f-babd46668724", 55)
      // Assert
      const exerciceSeanceUpdated = await prisma.exerciceSeance.findUnique({ where: { id: "5689ac30-8cb5-4bc8-9a6f-babd46668724" }})
      expect(exerciceSeanceUpdated?.tempsRepos).toEqual(55)
    })
  })
})
