import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { EntrainementBuilder } from "../../../application/EntrainementBuilder"
import { ExerciceEntrainementBuilder } from "../../../application/builders/ExerciceEntrainementBuilder"
import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
import { SerieEntrainementBuilder } from "../../../application/builders/SerieEntrainementBuilder"
import { SerieExerciceSeanceBuilder } from "../../../application/builders/SerieExerciceSeanceBuilder"
import { EntrainementRepository } from "../../../domain/ports/EntrainementRepository"
import { SeanceRepository } from "../../../domain/ports/SeanceRepository"
import { EntrainementController } from "../../../infrastructure/controllers/EntrainementController"
import { container } from "api"
import { EntrainementContrat } from "api/app/contrats/EntrainementContrat"
import { CATEGORIE } from "api/exercice/domain/categorie"
import { creerRequestPourCompteUtilisateur } from "api/testUtils/RequestUtils"
import { SeanceBuilder } from "api/testUtils/builders/SeanceBuilder"

describe("EntrainementController", () => {
  let entrainementController: EntrainementController
  let seanceRepository: SeanceRepository
  let entrainementRepository: EntrainementRepository

  beforeEach(() => {
    entrainementController = container.resolve("entrainementController")
    seanceRepository = container.resolve("seanceRepository")
    entrainementRepository = container.resolve("entrainementRepository")
  })

  describe("#demarrerEntrainement", () => {
    describe("Cas OK", () => {
      it("doit créer un nouvel entrainement à partir d'une séance", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")

        const serieExerciceSeance1 = new SerieExerciceSeanceBuilder().withRepetitions(8).build()
        const serieExerciceSeance2 = new SerieExerciceSeanceBuilder().withRepetitions(10).build()
        const serieExerciceSeance3 = new SerieExerciceSeanceBuilder().withRepetitions(12).build()
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
        const result = await entrainementController.demarrerEntrainement({ request, payload })
        // Assert
        expect(result.reasonPhrase).toEqual(ReasonPhrases.CREATED)
        const nouvelEntrainement = result.data as EntrainementContrat
        expect(nouvelEntrainement.id).toBeDefined()
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
        const payload = {
          idSerie: "c812e04e-f6c7-478d-bc37-19b7a5894de2",
          idExercice: "2c9d1005-19ce-4289-95b1-e11d41cab187"
        }
        // Act
        const result = await entrainementController.realiserSerie({
          request,
          payload
        })
        // Assert
        expect(result.reasonPhrase).toEqual(ReasonPhrases.NO_CONTENT)
      })
    })
  })
})
