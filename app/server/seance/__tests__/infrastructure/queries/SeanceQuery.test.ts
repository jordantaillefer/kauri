import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
import { SerieExerciceSeanceBuilder } from "../../../application/builders/SerieExerciceSeanceBuilder"
import type { Seance } from "../../../domain/Seance"
import type { ExerciceSeanceRepository } from "../../../domain/ports/ExerciceSeanceRepository"
import type { SeanceRepository } from "../../../domain/ports/SeanceRepository"
import type { SeanceQuery } from "../../../infrastructure/queries/SeanceQuery"
import type { SeanceContrat } from "app/server";
import { container } from "app/server"
import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import type { DetailSeanceContrat } from "~/server/app/contrats/DetailSeanceContrat"
import { CATEGORIE } from "~/server/exercice/domain/categorie"
import { creerRequest, creerRequestPourCompteUtilisateur } from "~/server/testUtils/RequestUtils"
import { SeanceBuilder } from "~/server/testUtils/builders/SeanceBuilder"

describe("SeanceQuery", () => {
  let seanceQuery: SeanceQuery
  let seanceRepository: SeanceRepository
  let exerciceSeanceRepository: ExerciceSeanceRepository

  beforeEach(() => {
    seanceQuery = container.resolve("seanceQuery")
    seanceRepository = container.resolve("seanceRepository")
    exerciceSeanceRepository = container.resolve("exerciceSeanceRepository")
  })

  describe("#listerSeance", () => {
    describe("Cas OK", () => {
      it(
        "doit récupérer la liste des séances de l'utilisateur",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur)
          const uuidSeance1 = testIdGenerator.getId()
          const uuidSeance2 = testIdGenerator.getId()
          const seanceUtilisateur1: Seance = new SeanceBuilder()
            .withId(uuidSeance1)
            .withIdUtilisateur(uuidUtilisateur)
            .withNomSeance("Seance 1")
            .build()
          const seanceUtilisateur2: Seance = new SeanceBuilder()
            .withId(uuidSeance2)
            .withIdUtilisateur(uuidUtilisateur)
            .withNomSeance("Seance 2")
            .build()
          const seanceAutreUtilisateur: Seance = new SeanceBuilder()
            .withId(testIdGenerator.getId())
            .withIdUtilisateur(testIdGenerator.getId())
            .build()
          await seanceRepository.creerSeance(seanceUtilisateur1)
          await seanceRepository.creerSeance(seanceUtilisateur2)
          await seanceRepository.creerSeance(seanceAutreUtilisateur)
          // Act
          const response = await seanceQuery.listerSeance({ request })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
          const listeSeance = response.data as DetailSeanceContrat[]
          expect(listeSeance).toBeDefined()
          expect(listeSeance).toHaveLength(2)
          expect(listeSeance.at(0)?.id).toEqual(uuidSeance1)
          expect(listeSeance.at(1)?.id).toEqual(uuidSeance2)
        })
      )

      it(
        "quand la séance a des exercices, doit récupérer les exercices",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur)
          // Arrange
          const uuidSeance1 = testIdGenerator.getId()
          const uuidSeance2 = testIdGenerator.getId()

          const exerciceSeance1 = new ExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(1)
            .withIdSeance(uuidSeance1)
            .build()
          const exerciceSeance2 = new ExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(2)
            .withIdSeance(uuidSeance1)
            .build()
          const exerciceSeance3 = new ExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(1)
            .withIdSeance(uuidSeance2)
            .build()
          const seance: Seance = new SeanceBuilder()
            .withId(uuidSeance1)
            .withIdUtilisateur(uuidUtilisateur)
            .withListeExerciceSeance(exerciceSeance1, exerciceSeance2)
            .build()
          const seance2: Seance = new SeanceBuilder().withId(uuidSeance2).withIdUtilisateur(uuidUtilisateur).build()
          await seanceRepository.creerSeance(seance)
          await seanceRepository.creerSeance(seance2)
          await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance1)
          await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance2)
          await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance3)
          // Act
          const response = await seanceQuery.listerSeance({ request })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
          const listeSeance = response.data as DetailSeanceContrat[]
          expect(listeSeance).toHaveLength(2)
          expect(listeSeance.at(0)?.exerciceSeances.at(0)?.ordre).toEqual(1)
          expect(listeSeance.at(0)?.exerciceSeances.at(1)?.ordre).toEqual(2)
          expect(listeSeance.at(1)?.exerciceSeances.at(0)?.ordre).toEqual(1)
        })
      )
    })

    describe("Cas KO", () => {
      it(
        "Quand l'utilisateur n'est pas connecté, erreur Unauthorized",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const request = creerRequest()
          // Act
          const response = await seanceQuery.listerSeance({ request })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
        })
      )
    })
  })

  describe("#listerSeanceParIds", () => {
    describe("Cas OK", () => {
      it(
        "doit récupérer la liste des séances demandé en paramètre de l'utilisateur",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur)
          const uuidSeance1 = testIdGenerator.getId()
          const uuidSeance2 = testIdGenerator.getId()
          const uuidSeance3 = testIdGenerator.getId()
          const seanceUtilisateur1: Seance = new SeanceBuilder()
            .withId(uuidSeance1)
            .withIdUtilisateur(uuidUtilisateur)
            .withNomSeance("Seance 1")
            .build()
          const seanceUtilisateur2: Seance = new SeanceBuilder()
            .withId(uuidSeance2)
            .withIdUtilisateur(uuidUtilisateur)
            .withNomSeance("Seance 2")
            .build()
          const seanceUtilisateur3: Seance = new SeanceBuilder()
            .withId(uuidSeance3)
            .withIdUtilisateur(uuidUtilisateur)
            .withNomSeance("Seance 3")
            .build()
          const seanceAutreUtilisateur: Seance = new SeanceBuilder()
            .withId(testIdGenerator.getId())
            .withIdUtilisateur(testIdGenerator.getId())
            .build()
          await seanceRepository.creerSeance(seanceUtilisateur1)
          await seanceRepository.creerSeance(seanceUtilisateur2)
          await seanceRepository.creerSeance(seanceUtilisateur3)
          await seanceRepository.creerSeance(seanceAutreUtilisateur)
          const payload = {
            listeSeanceIds: [uuidSeance1, uuidSeance3]
          }

          // Act
          const response = await seanceQuery.listerSeanceParIds({ request, payload })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
          const listeSeance = response.data as DetailSeanceContrat[]
          expect(listeSeance).toBeDefined()
          expect(listeSeance).toHaveLength(2)
          expect(listeSeance.at(0)?.id).toEqual(uuidSeance1)
          expect(listeSeance.at(1)?.id).toEqual(uuidSeance3)
        })
      )

      it(
        "quand la séance a des exercices, doit récupérer les exercices",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur)
          // Arrange
          const uuidSeance1 = testIdGenerator.getId()
          const uuidSeance2 = testIdGenerator.getId()

          const exerciceSeance1 = new ExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(1)
            .withIdSeance(uuidSeance1)
            .build()
          const exerciceSeance2 = new ExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(2)
            .withIdSeance(uuidSeance1)
            .build()
          const exerciceSeance3 = new ExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(1)
            .withIdSeance(uuidSeance2)
            .build()
          const seance: Seance = new SeanceBuilder()
            .withId(uuidSeance1)
            .withIdUtilisateur(uuidUtilisateur)
            .withListeExerciceSeance(exerciceSeance1, exerciceSeance2)
            .build()
          const seance2: Seance = new SeanceBuilder().withId(uuidSeance2).withIdUtilisateur(uuidUtilisateur).build()
          await seanceRepository.creerSeance(seance)
          await seanceRepository.creerSeance(seance2)
          await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance1)
          await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance2)
          await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance3)
          // Act
          const response = await seanceQuery.listerSeance({ request })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
          const listeSeance = response.data as DetailSeanceContrat[]
          expect(listeSeance).toHaveLength(2)
          expect(listeSeance.at(0)?.exerciceSeances.at(0)?.ordre).toEqual(1)
          expect(listeSeance.at(0)?.exerciceSeances.at(1)?.ordre).toEqual(2)
          expect(listeSeance.at(1)?.exerciceSeances.at(0)?.ordre).toEqual(1)
        })
      )
    })

    describe("Cas KO", () => {
      it(
        "Quand l'utilisateur n'est pas connecté, erreur Unauthorized",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const request = creerRequest()
          // Act
          const response = await seanceQuery.listerSeance({ request })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
        })
      )
    })
  })

  describe("#recupererSeanceParId", () => {
    describe("Cas OK", () => {
      it(
        "doit récupérer la séance de l'utilisateur",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur)
          const seanceUtilisateur1: Seance = new SeanceBuilder()
            .withId(testIdGenerator.getId())
            .withIdUtilisateur(uuidUtilisateur)
            .withNomSeance("Seance 1")
            .build()
          const seanceUtilisateur2: Seance = new SeanceBuilder()
            .withId(testIdGenerator.getId())
            .withIdUtilisateur(uuidUtilisateur)
            .withNomSeance("Seance 2")
            .build()
          const seanceAutreUtilisateur: Seance = new SeanceBuilder()
            .withId(testIdGenerator.getId())
            .withIdUtilisateur(testIdGenerator.getId())
            .build()
          await seanceRepository.creerSeance(seanceUtilisateur1)
          await seanceRepository.creerSeance(seanceUtilisateur2)
          await seanceRepository.creerSeance(seanceAutreUtilisateur)
          // Act
          const payload = { idSeance: seanceUtilisateur1.id }
          const response = await seanceQuery.recupererSeanceParId({ request, payload })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
          const seanceResult = response.data as SeanceContrat
          expect(seanceResult).toBeDefined()
          expect(seanceResult.id).toEqual(seanceUtilisateur1.id)
        })
      )

      it(
        "quand la séance a des exercices, doit récupérer les exercices",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur)
          // Arrange
          const uuidSeance1 = testIdGenerator.getId()
          const uuidSeance2 = testIdGenerator.getId()
          const exerciceSeance1 = new ExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(1)
            .withIdSeance(uuidSeance1)
            .build()
          const exerciceSeance2 = new ExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(2)
            .withIdSeance(uuidSeance1)
            .build()
          const exerciceSeance3 = new ExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(1)
            .withIdSeance(uuidSeance2)
            .build()
          const seance: Seance = new SeanceBuilder()
            .withId(uuidSeance1)
            .withIdUtilisateur(uuidUtilisateur)
            .withListeExerciceSeance(exerciceSeance1, exerciceSeance2)
            .build()
          const seance2: Seance = new SeanceBuilder().withId(uuidSeance2).withIdUtilisateur(uuidUtilisateur).build()
          await seanceRepository.creerSeance(seance)
          await seanceRepository.creerSeance(seance2)
          await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance1)
          await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance2)
          await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance3)
          // Act
          const payload = { idSeance: uuidSeance1 }
          const response = await seanceQuery.recupererSeanceParId({ request, payload })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
          const seanceResult = response.data as SeanceContrat
          expect(seanceResult).toBeDefined()
          expect(seanceResult.exerciceSeances.at(0)?.id).toEqual(exerciceSeance1.id)
          expect(seanceResult.exerciceSeances.at(0)?.ordre).toEqual(1)
          expect(seanceResult.exerciceSeances.at(1)?.id).toEqual(exerciceSeance2.id)
          expect(seanceResult.exerciceSeances.at(1)?.ordre).toEqual(2)
        })
      )
    })
    describe("Cas KO", () => {
      it(
        "Quand l'utilisateur n'est pas connecté, erreur Unauthorized",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const request = creerRequest()
          // Act
          const payload = { idSeance: "Peu importe l'id" }
          const response = await seanceQuery.recupererSeanceParId({ request, payload })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
        })
      )
    })
  })

  describe("#recupererDetailSeanceParId", () => {
    describe("Cas OK", () => {
      it(
        "quand la séance existe, doit récupérer le détail",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const uuidSeance1 = testIdGenerator.getId()
          const uuidSeance2 = testIdGenerator.getId()
          const uuidUtilisateur = testIdGenerator.getId()

          const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur)
          const serieExerciceSeance1 = new SerieExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(1)
            .withRepetitions(8)
            .withTempsRepos(20)
            .build()
          const serieExerciceSeance2 = new SerieExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(1)
            .withRepetitions(10)
            .withTempsRepos(25)
            .build()
          const serieExerciceSeance3 = new SerieExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(2)
            .withRepetitions(12)
            .withTempsRepos(30)
            .build()
          const exerciceSeance1 = new ExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(1)
            .withIdSeance(uuidSeance1)
            .withNomExercice("nomExercice 1")
            .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
            .withListeSerieExerciceSeance(serieExerciceSeance1)
            .build()
          const exerciceSeance2 = new ExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(2)
            .withIdSeance(uuidSeance1)
            .withNomExercice("nomExercice 2")
            .withCategorie(CATEGORIE.BICEPS)
            .withListeSerieExerciceSeance(serieExerciceSeance2, serieExerciceSeance3)
            .build()
          const exerciceSeance3 = new ExerciceSeanceBuilder()
            .withId(testIdGenerator.getId())
            .withOrdre(1)
            .withIdSeance(uuidSeance2)
            .build()
          const seance: Seance = new SeanceBuilder()
            .withId(uuidSeance1)
            .withIdUtilisateur(uuidUtilisateur)
            .withNomSeance("nomSeance")
            .withListeExerciceSeance(exerciceSeance1, exerciceSeance2)
            .build()
          const seance2: Seance = new SeanceBuilder().withId(uuidSeance2).withIdUtilisateur(uuidUtilisateur).build()
          await seanceRepository.creerSeance(seance)
          await seanceRepository.creerSeance(seance2)
          await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance1)
          await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance2)
          await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance3)
          // Act
          const payload = { idSeance: uuidSeance1 }
          const response = await seanceQuery.recupererDetailSeanceParId({ request, payload })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
          const detailSeanceContratResult = response.data as DetailSeanceContrat
          expect(detailSeanceContratResult).toBeDefined()
          expect(detailSeanceContratResult.nomSeance).toEqual("nomSeance")
          expect(detailSeanceContratResult.exerciceSeances.at(0)?.categorie).toEqual("Ischio-jambiers")
          expect(detailSeanceContratResult.exerciceSeances.at(0)?.ordre).toEqual(1)
          expect(detailSeanceContratResult.exerciceSeances.at(0)?.nomExercice).toEqual("nomExercice 1")
          expect(detailSeanceContratResult.exerciceSeances.at(0)?.series.at(0)?.repetitions).toEqual(8)
          expect(detailSeanceContratResult.exerciceSeances.at(0)?.series.at(0)?.tempsRepos).toEqual(20)
          expect(detailSeanceContratResult.exerciceSeances.at(0)?.series.at(0)?.ordre).toEqual(1)
          expect(detailSeanceContratResult.exerciceSeances.at(1)?.categorie).toEqual("Biceps")
          expect(detailSeanceContratResult.exerciceSeances.at(1)?.ordre).toEqual(2)
          expect(detailSeanceContratResult.exerciceSeances.at(1)?.nomExercice).toEqual("nomExercice 2")
          expect(detailSeanceContratResult.exerciceSeances.at(1)?.series.at(0)?.repetitions).toEqual(10)
          expect(detailSeanceContratResult.exerciceSeances.at(1)?.series.at(0)?.tempsRepos).toEqual(25)
          expect(detailSeanceContratResult.exerciceSeances.at(1)?.series.at(0)?.ordre).toEqual(1)
          expect(detailSeanceContratResult.exerciceSeances.at(1)?.series.at(1)?.repetitions).toEqual(12)
          expect(detailSeanceContratResult.exerciceSeances.at(1)?.series.at(1)?.tempsRepos).toEqual(30)
          expect(detailSeanceContratResult.exerciceSeances.at(1)?.series.at(1)?.ordre).toEqual(2)
        })
      )
    })

    describe("Cas KO", () => {
      it(
        "Quand l'utilisateur n'est pas connecté, erreur Unauthorized",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const request = creerRequest()
          // Act
          const payload = { idSeance: "Peu importe l'id" }
          const response = await seanceQuery.recupererDetailSeanceParId({ request, payload })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
        })
      )
    })
  })
})
