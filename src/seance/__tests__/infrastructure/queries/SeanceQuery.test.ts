import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
import { SerieExerciceSeanceBuilder } from "../../../application/builders/SerieExerciceSeanceBuilder"
import { Seance } from "../../../domain/Seance"
import { ExerciceSeanceRepository } from "../../../domain/ports/ExerciceSeanceRepository"
import { SeanceRepository } from "../../../domain/ports/SeanceRepository"
import { SeanceQuery } from "../../../infrastructure/queries/SeanceQuery"
import { container, SeanceContrat } from "api"
import { DetailSeanceContrat } from "api/app/contrats/DetailSeanceContrat"
import { CATEGORIE } from "api/exercice/domain/categorie"
import { creerRequest, creerRequestPourCompteUtilisateur } from "api/testUtils/RequestUtils"
import { SeanceBuilder } from "api/testUtils/builders/SeanceBuilder"

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
        const response = await seanceQuery.listerSeance({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const listeSeance = response.data as SeanceContrat[]
        expect(listeSeance).toBeDefined()
        expect(listeSeance).toHaveLength(2)
        expect(listeSeance.at(0)?.id).toEqual("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
        expect(listeSeance.at(1)?.id).toEqual("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
      })

      it("quand la séance a des exercices, doit récupérer les exercices", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        // Arrange
        const exerciceSeance1 = new ExerciceSeanceBuilder()
          .withId("bcb9405c-d460-4fe1-86a7-06d16610e78b")
          .withOrdre(1)
          .withTempsRepos(45)
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .build()
        const exerciceSeance2 = new ExerciceSeanceBuilder()
          .withId("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")
          .withOrdre(2)
          .withTempsRepos(55)
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .build()
        const exerciceSeance3 = new ExerciceSeanceBuilder()
          .withId("6a4b2f7f-119a-41b6-afd0-26ce35e334fb")
          .withOrdre(1)
          .withTempsRepos(75)
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
        const response = await seanceQuery.listerSeance({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const listeSeance = response.data as SeanceContrat[]
        expect(listeSeance).toHaveLength(2)
        expect(listeSeance.at(0)?.exerciceSeances.at(0)?.id).toEqual("bcb9405c-d460-4fe1-86a7-06d16610e78b")
        expect(listeSeance.at(0)?.exerciceSeances.at(0)?.ordre).toEqual(1)
        expect(listeSeance.at(0)?.exerciceSeances.at(0)?.tempsRepos).toEqual(45)
        expect(listeSeance.at(0)?.exerciceSeances.at(1)?.id).toEqual("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")
        expect(listeSeance.at(0)?.exerciceSeances.at(1)?.ordre).toEqual(2)
        expect(listeSeance.at(0)?.exerciceSeances.at(1)?.tempsRepos).toEqual(55)
        expect(listeSeance.at(1)?.exerciceSeances.at(0)?.id).toEqual("6a4b2f7f-119a-41b6-afd0-26ce35e334fb")
        expect(listeSeance.at(1)?.exerciceSeances.at(0)?.ordre).toEqual(1)
        expect(listeSeance.at(1)?.exerciceSeances.at(0)?.tempsRepos).toEqual(75)
      })
    })

    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const response = await seanceQuery.listerSeance({ request })
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
        const response = await seanceQuery.recupererSeanceParId({ request, payload })
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
        const exerciceSeance1 = new ExerciceSeanceBuilder()
          .withId("bcb9405c-d460-4fe1-86a7-06d16610e78b")
          .withOrdre(1)
          .withTempsRepos(45)
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .build()
        const exerciceSeance2 = new ExerciceSeanceBuilder()
          .withId("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")
          .withOrdre(2)
          .withTempsRepos(55)
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .build()
        const exerciceSeance3 = new ExerciceSeanceBuilder()
          .withId("6a4b2f7f-119a-41b6-afd0-26ce35e334fb")
          .withOrdre(1)
          .withTempsRepos(65)
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
        const response = await seanceQuery.recupererSeanceParId({ request, payload })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const seanceResult = response.data as SeanceContrat
        expect(seanceResult).toBeDefined()
        expect(seanceResult.exerciceSeances.at(0)?.id).toEqual("bcb9405c-d460-4fe1-86a7-06d16610e78b")
        expect(seanceResult.exerciceSeances.at(0)?.ordre).toEqual(1)
        expect(seanceResult.exerciceSeances.at(0)?.tempsRepos).toEqual(45)
        expect(seanceResult.exerciceSeances.at(1)?.id).toEqual("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")
        expect(seanceResult.exerciceSeances.at(1)?.ordre).toEqual(2)
        expect(seanceResult.exerciceSeances.at(1)?.tempsRepos).toEqual(55)
      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const payload = { idSeance: "Peu importe l'id" }
        const response = await seanceQuery.recupererSeanceParId({ request, payload })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })

  describe("#recupererDetailSeanceParId", () => {
    describe("Cas OK", () => {
      it("quand la séance existe, doit récupérer le détail", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        // Arrange
        const serieExerciceSeance1 = new SerieExerciceSeanceBuilder()
          .withId("4e583c9f-8d58-4b36-8853-66ee2eb307d2")
          .withOrdre(1)
          .withRepetitions(8)
          .build()
        const serieExerciceSeance2 = new SerieExerciceSeanceBuilder()
          .withId("c5a667c2-64fc-4d97-84d8-f5b3bd6569d4")
          .withOrdre(1)
          .withRepetitions(10)
          .build()
        const serieExerciceSeance3 = new SerieExerciceSeanceBuilder()
          .withId("0dea312f-4b60-4a8f-9d63-5818705f2b6d")
          .withOrdre(2)
          .withRepetitions(12)
          .build()
        const exerciceSeance1 = new ExerciceSeanceBuilder()
          .withId("bcb9405c-d460-4fe1-86a7-06d16610e78b")
          .withOrdre(1)
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .withNomExercice("nomExercice 1")
          .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
          .withTempsRepos(45)
          .withListeSerieExerciceSeance(serieExerciceSeance1)
          .build()
        const exerciceSeance2 = new ExerciceSeanceBuilder()
          .withId("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")
          .withOrdre(2)
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .withNomExercice("nomExercice 2")
          .withCategorie(CATEGORIE.BICEPS)
          .withTempsRepos(55)
          .withListeSerieExerciceSeance(serieExerciceSeance2, serieExerciceSeance3)
          .build()
        const exerciceSeance3 = new ExerciceSeanceBuilder()
          .withId("6a4b2f7f-119a-41b6-afd0-26ce35e334fb")
          .withOrdre(1)
          .withTempsRepos(65)
          .withIdSeance("fcf88475-e6d8-4062-9aa4-10411c1b15b5")
          .build()
        const seance: Seance = new SeanceBuilder()
          .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
          .withIdUtilisateur("idUtilisateur")
          .withNomSeance("nomSeance")
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
        const response = await seanceQuery.recupererDetailSeanceParId({ request, payload })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const detailSeanceContratResult = response.data as DetailSeanceContrat
        expect(detailSeanceContratResult).toBeDefined()
        expect(detailSeanceContratResult.nomSeance).toEqual("nomSeance")
        expect(detailSeanceContratResult.exerciceSeances.at(0)?.categorie).toEqual("Ischio-jambiers")
        expect(detailSeanceContratResult.exerciceSeances.at(0)?.ordre).toEqual(1)
        expect(detailSeanceContratResult.exerciceSeances.at(0)?.tempsRepos).toEqual(45)
        expect(detailSeanceContratResult.exerciceSeances.at(0)?.nomExercice).toEqual("nomExercice 1")
        expect(detailSeanceContratResult.exerciceSeances.at(0)?.series.at(0)?.repetitions).toEqual(8)
        expect(detailSeanceContratResult.exerciceSeances.at(0)?.series.at(0)?.ordre).toEqual(1)
        expect(detailSeanceContratResult.exerciceSeances.at(1)?.categorie).toEqual("Biceps")
        expect(detailSeanceContratResult.exerciceSeances.at(1)?.ordre).toEqual(2)
        expect(detailSeanceContratResult.exerciceSeances.at(1)?.tempsRepos).toEqual(55)
        expect(detailSeanceContratResult.exerciceSeances.at(1)?.nomExercice).toEqual("nomExercice 2")
        expect(detailSeanceContratResult.exerciceSeances.at(1)?.series.at(0)?.repetitions).toEqual(10)
        expect(detailSeanceContratResult.exerciceSeances.at(1)?.series.at(0)?.ordre).toEqual(1)
        expect(detailSeanceContratResult.exerciceSeances.at(1)?.series.at(1)?.repetitions).toEqual(12)
        expect(detailSeanceContratResult.exerciceSeances.at(1)?.series.at(1)?.ordre).toEqual(2)
      })
    })

    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const payload = { idSeance: "Peu importe l'id" }
        const response = await seanceQuery.recupererDetailSeanceParId({ request, payload })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })

})
