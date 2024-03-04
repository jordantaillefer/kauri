import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
import type { Seance } from "../../../domain/Seance"
import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import type { DetailSeanceContrat } from "~/.server/app/contrats/DetailSeanceContrat"
import { creerRequest, creerRequestPourCompteUtilisateur } from "~/.server/testUtils/RequestUtils"
import { SeanceBuilder } from "~/.server/testUtils/builders/SeanceBuilder"

describe("SeanceQuery", () => {
  describe("#listerSeance", () => {
    describe("Cas OK", () => {
      it(
        "doit récupérer la liste des séances de l'utilisateur",
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(container, uuidUtilisateur)
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
          await container.resolve('seanceRepository').creerSeance(seanceUtilisateur1)
          await container.resolve('seanceRepository').creerSeance(seanceUtilisateur2)
          await container.resolve('seanceRepository').creerSeance(seanceAutreUtilisateur)
          // Act
          const response = await container.resolve('seanceQuery').listerSeance({ request })
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
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(container, uuidUtilisateur)
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
          await container.resolve('seanceRepository').creerSeance(seance)
          await container.resolve('seanceRepository').creerSeance(seance2)
          await container.resolve('exerciceSeanceRepository').creerExerciceSeance(exerciceSeance1)
          await container.resolve('exerciceSeanceRepository').creerExerciceSeance(exerciceSeance2)
          await container.resolve('exerciceSeanceRepository').creerExerciceSeance(exerciceSeance3)
          // Act
          const response = await container.resolve('seanceQuery').listerSeance({ request })
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
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const request = creerRequest()
          // Act
          const response = await container.resolve('seanceQuery').listerSeance({ request })
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
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(container, uuidUtilisateur)
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
          await container.resolve('seanceRepository').creerSeance(seanceUtilisateur1)
          await container.resolve('seanceRepository').creerSeance(seanceUtilisateur2)
          await container.resolve('seanceRepository').creerSeance(seanceUtilisateur3)
          await container.resolve('seanceRepository').creerSeance(seanceAutreUtilisateur)
          const payload = {
            listeSeanceIds: [uuidSeance1, uuidSeance3]
          }

          // Act
          const response = await container.resolve('seanceQuery').listerSeanceParIds({ request, payload })

          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
          const listeSeance = response.data as DetailSeanceContrat[]
          expect(listeSeance).toBeDefined()
          expect(listeSeance).toHaveLength(2)
          expect(listeSeance).toContainEqual({
            id: uuidSeance1,
            nomSeance: "Seance 1",
            exerciceSeances: [],
          })
          expect(listeSeance).toContainEqual({
            id: uuidSeance3,
            nomSeance: "Seance 3",
            exerciceSeances: [],
          })
        })
      )

      it(
        "quand la séance a des exercices, doit récupérer les exercices",
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(container, uuidUtilisateur)
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
          await container.resolve('seanceRepository').creerSeance(seance)
          await container.resolve('seanceRepository').creerSeance(seance2)
          await container.resolve('exerciceSeanceRepository').creerExerciceSeance(exerciceSeance1)
          await container.resolve('exerciceSeanceRepository').creerExerciceSeance(exerciceSeance2)
          await container.resolve('exerciceSeanceRepository').creerExerciceSeance(exerciceSeance3)
          // Act
          const response = await container.resolve('seanceQuery').listerSeance({ request })
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
        integrationTestFunction(async ({ container }) => {
          // Arrange
          const request = creerRequest()
          // Act
          const response = await container.resolve('seanceQuery').listerSeance({ request })
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
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(container, uuidUtilisateur)
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
          await container.resolve('seanceRepository').creerSeance(seanceUtilisateur1)
          await container.resolve('seanceRepository').creerSeance(seanceUtilisateur2)
          await container.resolve('seanceRepository').creerSeance(seanceAutreUtilisateur)
          // Act
          const payload = { idSeance: seanceUtilisateur1.id }
          const response = await container.resolve('seanceQuery').recupererSeanceParId({ request, payload })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
          const seanceResult = response.data as DetailSeanceContrat
          expect(seanceResult).toBeDefined()
          expect(seanceResult.id).toEqual(seanceUtilisateur1.id)
        })
      )

      it(
        "quand la séance a des exercices, doit récupérer les exercices",
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(container, uuidUtilisateur)
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
          await container.resolve('seanceRepository').creerSeance(seance)
          await container.resolve('seanceRepository').creerSeance(seance2)
          await container.resolve('exerciceSeanceRepository').creerExerciceSeance(exerciceSeance1)
          await container.resolve('exerciceSeanceRepository').creerExerciceSeance(exerciceSeance2)
          await container.resolve('exerciceSeanceRepository').creerExerciceSeance(exerciceSeance3)
          // Act
          const payload = { idSeance: uuidSeance1 }
          const response = await container.resolve('seanceQuery').recupererSeanceParId({ request, payload })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
          const seanceResult = response.data as DetailSeanceContrat
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
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const request = creerRequest()
          // Act
          const payload = { idSeance: "Peu importe l'id" }
          const response = await container.resolve('seanceQuery').recupererSeanceParId({ request, payload })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
        })
      )
    })
  })
})
