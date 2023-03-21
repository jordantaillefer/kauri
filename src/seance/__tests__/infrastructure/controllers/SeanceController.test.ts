import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { DetailSeanceContrat } from "../../../../app/contrats/DetailSeanceContrat"
import { EntrainementContrat } from "../../../../app/contrats/EntrainementContrat"
import { CATEGORIE } from "../../../../exercice/domain/categorie"
import { creerRequest, creerRequestPourCompteUtilisateur } from "../../../../testUtils/RequestUtils"
import { SeanceBuilder } from "../../../../testUtils/builders/SeanceBuilder"
import { EntrainementBuilder } from "../../../application/EntrainementBuilder"
import { ExerciceEntrainementBuilder } from "../../../application/builders/ExerciceEntrainementBuilder"
import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
import { SerieEntrainementBuilder } from "../../../application/builders/SerieEntrainementBuilder"
import { SerieExerciceSeanceBuilder } from "../../../application/builders/SerieExerciceSeanceBuilder"
import { Entrainement } from "../../../domain/Entrainement"
import { Seance } from "../../../domain/Seance"
import { EntrainementRepository } from "../../../domain/ports/EntrainementRepository"
import { ExerciceSeanceRepository } from "../../../domain/ports/ExerciceSeanceRepository"
import { SeanceRepository } from "../../../domain/ports/SeanceRepository"
import { SeanceController } from "../../../infrastructure/controllers/SeanceController"
import { container, SeanceContrat } from "api"

describe("SeanceController", () => {
  let seanceController: SeanceController
  let seanceRepository: SeanceRepository
  let exerciceSeanceRepository: ExerciceSeanceRepository
  let entrainementRepository: EntrainementRepository

  beforeEach(() => {
    seanceController = container.resolve("seanceController")
    seanceRepository = container.resolve("seanceRepository")
    exerciceSeanceRepository = container.resolve("exerciceSeanceRepository")
    entrainementRepository = container.resolve("entrainementRepository")
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
        const exerciceSeance1 = new ExerciceSeanceBuilder()
          .withId("bcb9405c-d460-4fe1-86a7-06d16610e78b")
          .withOrdre(1)
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .build()
        const exerciceSeance2 = new ExerciceSeanceBuilder()
          .withId("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")
          .withOrdre(2)
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .build()
        const exerciceSeance3 = new ExerciceSeanceBuilder()
          .withId("6a4b2f7f-119a-41b6-afd0-26ce35e334fb")
          .withOrdre(1)
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
        expect(listeSeance.at(0)?.exerciceSeances.at(0)?.ordre).toEqual(1)
        expect(listeSeance.at(0)?.exerciceSeances.at(1)?.id).toEqual("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")
        expect(listeSeance.at(0)?.exerciceSeances.at(1)?.ordre).toEqual(2)
        expect(listeSeance.at(1)?.exerciceSeances.at(0)?.id).toEqual("6a4b2f7f-119a-41b6-afd0-26ce35e334fb")
        expect(listeSeance.at(1)?.exerciceSeances.at(0)?.ordre).toEqual(1)

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
        const exerciceSeance1 = new ExerciceSeanceBuilder()
          .withId("bcb9405c-d460-4fe1-86a7-06d16610e78b")
          .withOrdre(1)
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .build()
        const exerciceSeance2 = new ExerciceSeanceBuilder()
          .withId("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")
          .withOrdre(2)
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .build()
        const exerciceSeance3 = new ExerciceSeanceBuilder()
          .withId("6a4b2f7f-119a-41b6-afd0-26ce35e334fb")
          .withOrdre(1)
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
        expect(seanceResult.exerciceSeances.at(0)?.ordre).toEqual(1)
        expect(seanceResult.exerciceSeances.at(1)?.id).toEqual("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")
        expect(seanceResult.exerciceSeances.at(1)?.ordre).toEqual(2)

      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const payload = { idSeance: "Peu importe l'id" }
        const response = await seanceController.recupererSeanceParId({ request, payload })
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
          .withRepetitions(8)
          .build()
        const serieExerciceSeance2 = new SerieExerciceSeanceBuilder()
          .withId("c5a667c2-64fc-4d97-84d8-f5b3bd6569d4")
          .withRepetitions(10)
          .build()
        const serieExerciceSeance3 = new SerieExerciceSeanceBuilder()
          .withId("0dea312f-4b60-4a8f-9d63-5818705f2b6d")
          .withRepetitions(12)
          .build()
        const exerciceSeance1 = new ExerciceSeanceBuilder()
          .withId("bcb9405c-d460-4fe1-86a7-06d16610e78b")
          .withOrdre(1)
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .withNomExercice("nomExercice 1")
          .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
          .withListeSerieExerciceSeance(serieExerciceSeance1)
          .build()
        const exerciceSeance2 = new ExerciceSeanceBuilder()
          .withId("9d1ce411-65a1-46c0-8b7e-88867ae3fc27")
          .withOrdre(2)
          .withIdSeance("54d9eb29-5410-4428-936f-9d252799e4ce")
          .withNomExercice("nomExercice 2")
          .withCategorie(CATEGORIE.BICEPS)
          .withListeSerieExerciceSeance(serieExerciceSeance2, serieExerciceSeance3)
          .build()
        const exerciceSeance3 = new ExerciceSeanceBuilder()
          .withId("6a4b2f7f-119a-41b6-afd0-26ce35e334fb")
          .withOrdre(1)
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
        const response = await seanceController.recupererDetailSeanceParId({ request, payload })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const seanceResult = response.data as DetailSeanceContrat
        expect(seanceResult).toBeDefined()
        expect(seanceResult.nomSeance).toEqual("nomSeance")
        expect(seanceResult.exerciceSeances.at(0)?.categorie).toEqual("Ischio-jambiers")
        expect(seanceResult.exerciceSeances.at(0)?.ordre).toEqual(1)
        expect(seanceResult.exerciceSeances.at(0)?.nomExercice).toEqual("nomExercice 1")
        expect(seanceResult.exerciceSeances.at(0)?.series.at(0)?.repetitions).toEqual(8)
        expect(seanceResult.exerciceSeances.at(1)?.categorie).toEqual("Biceps")
        expect(seanceResult.exerciceSeances.at(1)?.ordre).toEqual(2)
        expect(seanceResult.exerciceSeances.at(1)?.nomExercice).toEqual("nomExercice 2")
        expect(seanceResult.exerciceSeances.at(1)?.series.at(0)?.repetitions).toEqual(10)
        expect(seanceResult.exerciceSeances.at(1)?.series.at(1)?.repetitions).toEqual(12)

      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const payload = { idSeance: "Peu importe l'id" }
        const response = await seanceController.recupererDetailSeanceParId({ request, payload })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })

  describe("#demarrerEntrainement", () => {
    describe("Cas OK", () => {
      it("doit créer un nouvel entrainement à partir d'une séance", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")

        const serieExerciceSeance1 = new SerieExerciceSeanceBuilder()
          .withRepetitions(8)
          .build()
        const serieExerciceSeance2 = new SerieExerciceSeanceBuilder()
          .withRepetitions(10)
          .build()
        const serieExerciceSeance3 = new SerieExerciceSeanceBuilder()
          .withRepetitions(12)
          .build()
        const exercice1 = new ExerciceSeanceBuilder()
          .withNomExercice("nomExercice 1")
          .withCategorie(CATEGORIE.PECTORAUX)
          .withListeSerieExerciceSeance(serieExerciceSeance1)
          .build()
        const exercice2 = new ExerciceSeanceBuilder()
          .withNomExercice("nomExercice 2")
          .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
          .withListeSerieExerciceSeance(serieExerciceSeance2, serieExerciceSeance3)
          .build()
        const seance = new SeanceBuilder()
          .withId("4b472a1c-72e9-4465-b2dc-b4dced658ad9")
          .withNomSeance("nomSeance 1")
          .withListeExerciceSeance(exercice1, exercice2)
          .build()
        await seanceRepository.creerSeance(seance)
        const payload = { idSeance: "4b472a1c-72e9-4465-b2dc-b4dced658ad9" }
        // Act
        const result = await seanceController.demarrerEntrainement({ request, payload })
        // Assert
        expect(result.reasonPhrase).toEqual(ReasonPhrases.CREATED)
        const nouvelEntrainement = result.data as EntrainementContrat
        expect(nouvelEntrainement.id).toBeDefined()
      })
    })
  })

  describe("#recuperEntrainementParId", () => {
    describe("Cas OK", () => {
      it("quand l'entrainement existe, doit récuperer l'entrainement", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")

        const serieEntrainement1 = new SerieEntrainementBuilder()
          .withId("c812e04e-f6c7-478d-bc37-19b7a5894de2")
          .withNombreRepetition(8)
          .withEstRealise(false)
          .build()
        const serieEntrainement2 = new SerieEntrainementBuilder()
          .withId("38e5ae21-7fee-427a-97b7-1f2ee7a02ef2")
          .withNombreRepetition(10)
          .withEstRealise(true)
          .build()
        const serieEntrainement3 = new SerieEntrainementBuilder()
          .withId("2d9cee66-ddd3-4cb1-94d9-b9bbea290032")
          .withNombreRepetition(12)
          .withEstRealise(false)
          .build()
        const exerciceSeance1 = new ExerciceEntrainementBuilder()
          .withId("2c9d1005-19ce-4289-95b1-e11d41cab187")
          .withEstRealise(false)
          .withTempsRepos(45)
          .withNomExercice("nomExercice 1")
          .withCategorie(CATEGORIE.PECTORAUX)
          .withListeSerieEntrainement(serieEntrainement1)
          .build()
        const exerciceSeance2 = new ExerciceEntrainementBuilder()
          .withId("79dd6cc5-d54a-4821-ac9a-709f42e87875")
          .withEstRealise(true)
          .withTempsRepos(55)
          .withNomExercice("nomExercice 2")
          .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
          .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
          .build()
        const entrainement = new EntrainementBuilder()
          .withId("070f4bbf-7a6b-4cb8-b14e-a03fac26b3e1")
          .withNomSeance("nomSeance")
          .withListeExerciceEntrainement(exerciceSeance1, exerciceSeance2)
          .build()
        await entrainementRepository.creerEntrainement(entrainement)
        const payload = { idEntrainement: "070f4bbf-7a6b-4cb8-b14e-a03fac26b3e1" }
        // Act
        const result = await seanceController.recupererEntrainementParId({
          request,
          payload
        })
        // Assert
        expect(result.reasonPhrase).toEqual(ReasonPhrases.OK)
        const entrainementResult = result.data as EntrainementContrat
        expect(entrainementResult.id).toEqual("070f4bbf-7a6b-4cb8-b14e-a03fac26b3e1")
        expect(entrainementResult.nomSeance).toEqual("nomSeance")
        expect(entrainementResult.listeExerciceEntrainement).toHaveLength(2)
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.id).toEqual("2c9d1005-19ce-4289-95b1-e11d41cab187")
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.estRealise).toEqual(false)
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.tempsRepos).toEqual(45)
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.nomExercice).toEqual("nomExercice 1")
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.categorie).toEqual("Pectoraux")
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.listeSerieEntrainement).toHaveLength(1)
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.id).toEqual("c812e04e-f6c7-478d-bc37-19b7a5894de2")
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.nombreRepetition).toEqual(8)
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.estRealise).toEqual(false)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.id).toEqual("79dd6cc5-d54a-4821-ac9a-709f42e87875")
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.estRealise).toEqual(true)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.tempsRepos).toEqual(55)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.nomExercice).toEqual("nomExercice 2")
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.categorie).toEqual("Ischio-jambiers")
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement).toHaveLength(2)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.id).toEqual("38e5ae21-7fee-427a-97b7-1f2ee7a02ef2")
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.nombreRepetition).toEqual(10)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.estRealise).toEqual(true)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.id).toEqual("2d9cee66-ddd3-4cb1-94d9-b9bbea290032")
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.nombreRepetition).toEqual(12)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.estRealise).toEqual(false)
      })
    })
  })

  describe("#realiserSerie", () => {
    describe("Cas OK", () => {
      it("doit faire passer la série à réalisée", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")

        const serieEntrainement1 = new SerieEntrainementBuilder()
          .withId("c812e04e-f6c7-478d-bc37-19b7a5894de2")
          .withNombreRepetition(8)
          .withEstRealise(false)
          .build()
        const serieEntrainement2 = new SerieEntrainementBuilder()
          .withId("38e5ae21-7fee-427a-97b7-1f2ee7a02ef2")
          .withNombreRepetition(10)
          .withEstRealise(true)
          .build()
        const serieEntrainement3 = new SerieEntrainementBuilder()
          .withId("2d9cee66-ddd3-4cb1-94d9-b9bbea290032")
          .withNombreRepetition(12)
          .withEstRealise(false)
          .build()
        const exerciceSeance1 = new ExerciceEntrainementBuilder()
          .withId("2c9d1005-19ce-4289-95b1-e11d41cab187")
          .withEstRealise(false)
          .withTempsRepos(45)
          .withNomExercice("nomExercice 1")
          .withCategorie(CATEGORIE.PECTORAUX)
          .withListeSerieEntrainement(serieEntrainement1)
          .build()
        const exerciceSeance2 = new ExerciceEntrainementBuilder()
          .withId("79dd6cc5-d54a-4821-ac9a-709f42e87875")
          .withEstRealise(true)
          .withTempsRepos(55)
          .withNomExercice("nomExercice 2")
          .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
          .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
          .build()
        const entrainement = new EntrainementBuilder()
          .withId("070f4bbf-7a6b-4cb8-b14e-a03fac26b3e1")
          .withNomSeance("nomSeance")
          .withListeExerciceEntrainement(exerciceSeance1, exerciceSeance2)
          .build()
        await entrainementRepository.creerEntrainement(entrainement)
        const payload = { idSerie: "c812e04e-f6c7-478d-bc37-19b7a5894de2" }
        // Act
        const result = await seanceController.realiserSerie({
          request,
          payload
        })
        // Assert
        expect(result.reasonPhrase).toEqual(ReasonPhrases.NO_CONTENT)
      })
    })
  })

  describe("#realiserEntrainement", () => {
    describe("Cas OK", () => {
      it("doit faire passer l'entrainement à réalisé", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")

        const serieEntrainement1 = new SerieEntrainementBuilder()
          .withId("c812e04e-f6c7-478d-bc37-19b7a5894de2")
          .withNombreRepetition(8)
          .withEstRealise(false)
          .build()
        const serieEntrainement2 = new SerieEntrainementBuilder()
          .withId("38e5ae21-7fee-427a-97b7-1f2ee7a02ef2")
          .withNombreRepetition(10)
          .withEstRealise(true)
          .build()
        const serieEntrainement3 = new SerieEntrainementBuilder()
          .withId("2d9cee66-ddd3-4cb1-94d9-b9bbea290032")
          .withNombreRepetition(12)
          .withEstRealise(false)
          .build()
        const exerciceSeance1 = new ExerciceEntrainementBuilder()
          .withId("2c9d1005-19ce-4289-95b1-e11d41cab187")
          .withEstRealise(false)
          .withTempsRepos(45)
          .withNomExercice("nomExercice 1")
          .withCategorie(CATEGORIE.PECTORAUX)
          .withListeSerieEntrainement(serieEntrainement1)
          .build()
        const exerciceSeance2 = new ExerciceEntrainementBuilder()
          .withId("79dd6cc5-d54a-4821-ac9a-709f42e87875")
          .withEstRealise(false)
          .withTempsRepos(55)
          .withNomExercice("nomExercice 2")
          .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
          .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
          .build()
        const entrainement = new EntrainementBuilder()
          .withId("070f4bbf-7a6b-4cb8-b14e-a03fac26b3e1")
          .withNomSeance("nomSeance")
          .withListeExerciceEntrainement(exerciceSeance1, exerciceSeance2)
          .build()
        await entrainementRepository.creerEntrainement(entrainement)
        const payload = { idEntrainement: "79dd6cc5-d54a-4821-ac9a-709f42e87875" }
        // Act
        const result = await seanceController.realiserEntrainement({
          request,
          payload
        })
        // Assert
        expect(result.reasonPhrase).toEqual(ReasonPhrases.NO_CONTENT)
      })
    })
  })

  describe("#listerEntrainement", () => {
    describe("Cas OK", () => {
      it("doit récupérer la liste des séances de l'utilisateur", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        const entrainementUtilisateur1: Entrainement = new EntrainementBuilder()
          .withId("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
          .withNomSeance("Seance 1")
          .build()
        const entrainementUtilisateur2: Entrainement = new EntrainementBuilder()
          .withId("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
          .withNomSeance("Seance 2")
          .build()
        const entrainementAutreUtilisateur: Entrainement = new EntrainementBuilder()
          .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
          .build()
        await entrainementRepository.creerEntrainement(entrainementUtilisateur1)
        await entrainementRepository.creerEntrainement(entrainementUtilisateur2)
        await entrainementRepository.creerEntrainement(entrainementAutreUtilisateur)
        // Act
        const response = await seanceController.listerEntrainement({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const listeEntrainement = response.data as EntrainementContrat[]
        expect(listeEntrainement).toBeDefined()
        expect(listeEntrainement).toHaveLength(3)
        expect(listeEntrainement.at(0)?.id).toEqual("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
        expect(listeEntrainement.at(1)?.id).toEqual("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const response = await seanceController.listerEntrainement({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })
})
