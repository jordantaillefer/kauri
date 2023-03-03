import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { CATEGORIE } from "../../../../exercice/domain/categorie"
import { SeanceBuilder } from "../../../../testUtils/builders/SeanceBuilder"
import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
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
})