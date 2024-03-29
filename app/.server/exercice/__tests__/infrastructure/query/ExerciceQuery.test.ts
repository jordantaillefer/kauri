import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import type { Exercice } from "../../../domain/Exercice"
import { CATEGORIE } from "../../../domain/categorie"
import { creerRequest, creerRequestPourCompteUtilisateur } from "~/.server/testUtils/RequestUtils"
import { ExerciceBuilder } from "~/.server/testUtils/builders/ExerciceBuilder"
import { ListeExerciceContrat } from "@/api/app/contrats"

describe("ExerciceQuery", () => {
  describe("#listerExercice", () => {
    describe("Cas OK", () => {
      it(
        "doit récupérer la liste des exercices",
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const uuidExercice1 = testIdGenerator.getId()
          const uuidExercice2 = testIdGenerator.getId()
          const uuidExercice3 = testIdGenerator.getId()

          const request = await creerRequestPourCompteUtilisateur(container, uuidUtilisateur)
          const exercice1: Exercice = new ExerciceBuilder()
            .withId(uuidExercice1)
            .withNomExercice("Exercice 1")
            .withCategorie(CATEGORIE.ABDOMINAUX)
            .build()
          const exercice2: Exercice = new ExerciceBuilder()
            .withId(uuidExercice2)
            .withNomExercice("Exercice 2")
            .withCategorie(CATEGORIE.BICEPS)
            .build()
          const exercice3: Exercice = new ExerciceBuilder()
            .withId(uuidExercice3)
            .withNomExercice("Exercice 3")
            .withCategorie(CATEGORIE.BICEPS)
            .build()
          await container.resolve("exerciceRepository").creerExercice(exercice1)
          await container.resolve("exerciceRepository").creerExercice(exercice2)
          await container.resolve("exerciceRepository").creerExercice(exercice3)
          // Act
          const response = await container.resolve("exerciceQuery").listerExercice({ request })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
          const listeExercice = response.data as ListeExerciceContrat

          const keys = Array.from(Object.entries(listeExercice))
          const values = Array.from(Object.values(listeExercice))
          expect(keys).toHaveLength(2)
          expect(keys.at(0)?.at(0)).toEqual("Abdominaux")
          expect(values.at(0)?.at(0)?.id).toEqual(uuidExercice1)
          expect(keys.at(1)?.at(0)).toEqual("Biceps")
          expect(values.at(1)?.at(0)?.id).toEqual(uuidExercice2)
          expect(values.at(1)?.at(1)?.id).toEqual(uuidExercice3)
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
          const response = await container.resolve("exerciceQuery").listerExercice({ request })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
        })
      )
    })
  })
})
