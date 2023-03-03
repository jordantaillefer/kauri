import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { creerRequest, creerRequestPourCompteUtilisateur } from "../../../../testUtils/RequestUtils"
import { ExerciceBuilder } from "../../../../testUtils/builders/ExerciceBuilder"
import { Exercice } from "../../../domain/Exercice"
import { CATEGORIE } from "../../../domain/categorie"
import { ExerciceRepository } from "../../../domain/ports/ExerciceRepository"
import { ExerciceController } from "../../../infrastructure/controllers/ExerciceController"
import { container, ListeExerciceContrat } from "api"

describe("ExerciceController", () => {
  let exerciceController: ExerciceController
  let exerciceRepository: ExerciceRepository

  beforeEach(() => {
    exerciceController = container.resolve("exerciceController")
    exerciceRepository = container.resolve("exerciceRepository")
  })

  describe("#listerExercice", () => {
    describe("Cas OK", () => {
      it("doit récupérer la liste des exercices", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        const exercice1: Exercice = new ExerciceBuilder()
          .withId("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
          .withNomExercice("Exercice 1")
          .withCategorie(CATEGORIE.ABDOMINAUX)
          .build()
        const exercice2: Exercice = new ExerciceBuilder()
          .withId("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
          .withNomExercice("Exercice 2")
          .withCategorie(CATEGORIE.BICEPS)
          .build()
        const exercice3: Exercice = new ExerciceBuilder()
          .withId("855d6ae2-7f3a-4482-843c-e2387c6f940c")
          .withNomExercice("Exercice 3")
          .withCategorie(CATEGORIE.BICEPS)
          .build()
        await exerciceRepository.creerExercice(exercice1)
        await exerciceRepository.creerExercice(exercice2)
        await exerciceRepository.creerExercice(exercice3)
        // Act
        const response = await exerciceController.listerExercice({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const listeExercice = response.data as ListeExerciceContrat

        const keys = Array.from(listeExercice.entries())
        const values = Array.from(listeExercice.values())
        expect(keys).toHaveLength(2)
        expect(keys.at(0)?.at(0)).toEqual("Abdominaux")
        expect(values.at(0)?.at(0)?.id).toEqual("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
        expect(keys.at(1)?.at(0)).toEqual("Biceps")
        expect(values.at(1)?.at(0)?.id).toEqual("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
        expect(values.at(1)?.at(1)?.id).toEqual("855d6ae2-7f3a-4482-843c-e2387c6f940c")
      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const response = await exerciceController.listerExercice({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })
})