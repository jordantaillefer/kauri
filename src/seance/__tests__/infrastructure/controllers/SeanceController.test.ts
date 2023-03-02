import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { creerRequest, creerRequestPourCompteUtilisateur } from "../../../../testUtils/RequestUtils"
import { SeanceBuilder } from "../../../../testUtils/builders/SeanceBuilder"
import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
import { Seance } from "../../../domain/Seance"
import { ExerciceSeanceRepository } from "../../../domain/ports/ExerciceSeanceRepository"
import { SeanceRepository } from "../../../domain/ports/SeanceRepository"
import { SeanceController } from "../../../infrastructure/controllers/SeanceController"
import { container, SeanceContrat } from "api"

describe("SeanceController", () => {
  let seanceController: SeanceController
  let seanceRepository: SeanceRepository
  let exerciceSeanceRepository: ExerciceSeanceRepository

  beforeEach(() => {
    seanceController = container.resolve("seanceController")
    seanceRepository = container.resolve("seanceRepository")
    exerciceSeanceRepository = container.resolve("exerciceSeanceRepository")
  })

  describe("#initialiserSeance", () => {
    describe("Cas OK", () => {
      it("doit initialiser une seance", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")

        // Act
        const response = await seanceController.initialiserSeance({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
        const nouvelleSeance = response.data as SeanceContrat
        expect(nouvelleSeance).toBeDefined()
        expect(nouvelleSeance.nomSeance).toEqual("Nouvelle séance")
      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const response = await seanceController.initialiserSeance({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })

  describe("#listerSeance", () => {
    describe("Cas OK", () => {
      it("doit récupérer la liste des séances de l'utilisateur", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        const seanceUtilisateur1: Seance = new SeanceBuilder()
          .withId("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
          .withIdUtilisateur("idUtilisateur")
          .withNomSeance("Seance 1")
          .build()
        const seanceUtilisateur2: Seance = new SeanceBuilder()
          .withId("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
          .withIdUtilisateur("idUtilisateur")
          .withNomSeance("Seance 2")
          .build()
        const seanceAutreUtilisateur: Seance = new SeanceBuilder()
          .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
          .withIdUtilisateur("idAutreUtilisateur")
          .build()
        await seanceRepository.creerSeance(seanceUtilisateur1)
        await seanceRepository.creerSeance(seanceUtilisateur2)
        await seanceRepository.creerSeance(seanceAutreUtilisateur)
        // Act
        const response = await seanceController.listerSeance({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const listeSeance = response.data as SeanceContrat[]
        expect(listeSeance).toBeDefined()
        expect(listeSeance).toHaveLength(2)
        expect(listeSeance.at(0)?.id).toEqual("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
        expect(listeSeance.at(1)?.id).toEqual("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
      })

      it("quand la séance a des exercices, doit récuperer les exercices", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        // Arrange
        let exerciceSeance1 = new ExerciceSeanceBuilder()
          .withId("bcb9405c-d460-4fe1-86a7-06d16610e78b")
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .build()
        let exerciceSeance2 = new ExerciceSeanceBuilder()
          .withId("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .build()
        let exerciceSeance3 = new ExerciceSeanceBuilder()
          .withId("6a4b2f7f-119a-41b6-afd0-26ce35e334fb")
          .withIdSeance("fcf88475-e6d8-4062-9aa4-10411c1b15b5")
          .build()
        const seance: Seance = new SeanceBuilder()
          .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
          .withIdUtilisateur("idUtilisateur")
          .withListeExerciceSeance(exerciceSeance1, exerciceSeance2)
          .build()
        const seance2: Seance = new SeanceBuilder()
          .withId("fcf88475-e6d8-4062-9aa4-10411c1b15b5")
          .withIdUtilisateur("idUtilisateur")
          .build()
        await seanceRepository.creerSeance(seance)
        await seanceRepository.creerSeance(seance2)
        await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance1)
        await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance2)
        await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance3)
        // Act
        const response = await seanceController.listerSeance({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const listeSeance = response.data as SeanceContrat[]
        expect(listeSeance).toHaveLength(2)
        expect(listeSeance.at(0)?.exerciceSeances.at(0)?.id).toEqual("bcb9405c-d460-4fe1-86a7-06d16610e78b")
        expect(listeSeance.at(0)?.exerciceSeances.at(1)?.id).toEqual("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")
        expect(listeSeance.at(1)?.exerciceSeances.at(0)?.id).toEqual("6a4b2f7f-119a-41b6-afd0-26ce35e334fb")

      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const response = await seanceController.listerSeance({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })

  describe("#recupererSeanceParId", () => {
    describe("Cas OK", () => {
      it("doit récupérer la séance de l'utilisateur", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        const seanceUtilisateur1: Seance = new SeanceBuilder()
          .withId("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
          .withIdUtilisateur("idUtilisateur")
          .withNomSeance("Seance 1")
          .build()
        const seanceUtilisateur2: Seance = new SeanceBuilder()
          .withId("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
          .withIdUtilisateur("idUtilisateur")
          .withNomSeance("Seance 2")
          .build()
        const seanceAutreUtilisateur: Seance = new SeanceBuilder()
          .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
          .withIdUtilisateur("idAutreUtilisateur")
          .build()
        await seanceRepository.creerSeance(seanceUtilisateur1)
        await seanceRepository.creerSeance(seanceUtilisateur2)
        await seanceRepository.creerSeance(seanceAutreUtilisateur)
        // Act
        const payload = { idSeance: "859ec5a7-2a34-43fd-bec9-a43ac66238bd" }
        const response = await seanceController.recupererSeanceParId({ request, payload })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const seanceResult = response.data as SeanceContrat
        expect(seanceResult).toBeDefined()
        expect(seanceResult.id).toEqual("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
      })

      it("quand la séance a des exercices, doit récuperer les exercices", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        // Arrange
        let exerciceSeance1 = new ExerciceSeanceBuilder()
          .withId("bcb9405c-d460-4fe1-86a7-06d16610e78b")
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .build()
        let exerciceSeance2 = new ExerciceSeanceBuilder()
          .withId("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .build()
        let exerciceSeance3 = new ExerciceSeanceBuilder()
          .withId("6a4b2f7f-119a-41b6-afd0-26ce35e334fb")
          .withIdSeance("fcf88475-e6d8-4062-9aa4-10411c1b15b5")
          .build()
        const seance: Seance = new SeanceBuilder()
          .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
          .withIdUtilisateur("idUtilisateur")
          .withListeExerciceSeance(exerciceSeance1, exerciceSeance2)
          .build()
        const seance2: Seance = new SeanceBuilder()
          .withId("fcf88475-e6d8-4062-9aa4-10411c1b15b5")
          .withIdUtilisateur("idUtilisateur")
          .build()
        await seanceRepository.creerSeance(seance)
        await seanceRepository.creerSeance(seance2)
        await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance1)
        await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance2)
        await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance3)
        // Act
        const payload = { idSeance: "54d9eb29-5410-4428-936f-9d252799e4ce" }
        const response = await seanceController.recupererSeanceParId({ request, payload })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const seanceResult = response.data as SeanceContrat
        expect(seanceResult).toBeDefined()
        expect(seanceResult.exerciceSeances.at(0)?.id).toEqual("bcb9405c-d460-4fe1-86a7-06d16610e78b")
        expect(seanceResult.exerciceSeances.at(1)?.id).toEqual("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")

      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const response = await seanceController.recupererSeanceParId({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })
})