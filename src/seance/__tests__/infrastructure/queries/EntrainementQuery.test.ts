import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { EntrainementBuilder } from "../../../application/EntrainementBuilder"
import { ExerciceEntrainementBuilder } from "../../../application/builders/ExerciceEntrainementBuilder"
import { SerieEntrainementBuilder } from "../../../application/builders/SerieEntrainementBuilder"
import { Entrainement } from "../../../domain/Entrainement"
import { EntrainementRepository } from "../../../domain/ports/EntrainementRepository"
import { container } from "api"
import { DetailEntrainementContrat, EntrainementContrat } from "api/app/contrats/EntrainementContrat";
import { CATEGORIE } from "api/exercice/domain/categorie"
import { EntrainementQuery } from "api/seance/infrastructure/queries/EntrainementQuery"
import { creerRequest, creerRequestPourCompteUtilisateur } from "api/testUtils/RequestUtils"

describe("EntrainementQuery", () => {
  let entrainementQuery: EntrainementQuery
  let entrainementRepository: EntrainementRepository

  beforeEach(() => {
    entrainementQuery = container.resolve("entrainementQuery")
    entrainementRepository = container.resolve("entrainementRepository")
  })

  describe("#recuperEntrainementParId", () => {
    describe("Cas OK", () => {
      it("quand l'entrainement existe, doit récupérer l'entrainement", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")

        const serieEntrainement1 = new SerieEntrainementBuilder()
          .withId("c812e04e-f6c7-478d-bc37-19b7a5894de2")
          .withNombreRepetition(8)
          .withOrdre(1)
          .withEstRealise(false)
          .build()
        const serieEntrainement2 = new SerieEntrainementBuilder()
          .withId("38e5ae21-7fee-427a-97b7-1f2ee7a02ef2")
          .withNombreRepetition(10)
          .withOrdre(1)
          .withEstRealise(true)
          .build()
        const serieEntrainement3 = new SerieEntrainementBuilder()
          .withId("2d9cee66-ddd3-4cb1-94d9-b9bbea290032")
          .withNombreRepetition(12)
          .withOrdre(2)
          .withEstRealise(false)
          .build()
        const exerciceSeance1 = new ExerciceEntrainementBuilder()
          .withId("2c9d1005-19ce-4289-95b1-e11d41cab187")
          .withEstRealise(false)
          .withTempsRepos(45)
          .withNomExercice("nomExercice 1")
          .withOrdre(1)
          .withCategorie(CATEGORIE.PECTORAUX)
          .withListeSerieEntrainement(serieEntrainement1)
          .build()
        const exerciceSeance2 = new ExerciceEntrainementBuilder()
          .withId("79dd6cc5-d54a-4821-ac9a-709f42e87875")
          .withEstRealise(true)
          .withTempsRepos(55)
          .withNomExercice("nomExercice 2")
          .withOrdre(2)
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
        const result = await entrainementQuery.recupererEntrainementParId({
          request,
          payload
        })
        // Assert
        expect(result.reasonPhrase).toEqual(ReasonPhrases.OK)
        const entrainementResult = result.data as DetailEntrainementContrat
        expect(entrainementResult.id).toEqual("070f4bbf-7a6b-4cb8-b14e-a03fac26b3e1")
        expect(entrainementResult.nomSeance).toEqual("nomSeance")
        expect(entrainementResult.listeExerciceEntrainement).toHaveLength(2)
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.id).toEqual("2c9d1005-19ce-4289-95b1-e11d41cab187")
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.estRealise).toEqual(false)
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.tempsRepos).toEqual(45)
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.nomExercice).toEqual("nomExercice 1")
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.ordre).toEqual(1)
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.categorie).toEqual("Pectoraux")
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.listeSerieEntrainement).toHaveLength(1)
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.id).toEqual(
          "c812e04e-f6c7-478d-bc37-19b7a5894de2"
        )
        expect(
          entrainementResult.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.nombreRepetition
        ).toEqual(8)
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.ordre).toEqual(1)
        expect(entrainementResult.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.estRealise).toEqual(
          false
        )
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.id).toEqual("79dd6cc5-d54a-4821-ac9a-709f42e87875")
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.estRealise).toEqual(true)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.tempsRepos).toEqual(55)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.nomExercice).toEqual("nomExercice 2")
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.ordre).toEqual(2)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.categorie).toEqual("Ischio-jambiers")
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement).toHaveLength(2)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.id).toEqual(
          "38e5ae21-7fee-427a-97b7-1f2ee7a02ef2"
        )
        expect(
          entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.nombreRepetition
        ).toEqual(10)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.ordre).toEqual(1)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.estRealise).toEqual(
          true
        )
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.id).toEqual(
          "2d9cee66-ddd3-4cb1-94d9-b9bbea290032"
        )
        expect(
          entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.nombreRepetition
        ).toEqual(12)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.ordre).toEqual(2)
        expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.estRealise).toEqual(
          false
        )
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
          .withIdUtilisateur("idUtilisateur")
          .build()
        const entrainementUtilisateur2: Entrainement = new EntrainementBuilder()
          .withId("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
          .withNomSeance("Seance 2")
          .withIdUtilisateur("idUtilisateur")
          .build()
        const entrainementAutreUtilisateur: Entrainement = new EntrainementBuilder()
          .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
          .withIdUtilisateur("idAutreUtilisateur")
          .build()
        await entrainementRepository.creerEntrainement(entrainementUtilisateur1)
        await entrainementRepository.creerEntrainement(entrainementUtilisateur2)
        await entrainementRepository.creerEntrainement(entrainementAutreUtilisateur)
        // Act
        const response = await entrainementQuery.listerEntrainement({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const listeEntrainement = response.data as EntrainementContrat[]
        expect(listeEntrainement).toBeDefined()
        expect(listeEntrainement).toHaveLength(2)
        expect(listeEntrainement.at(0)?.id).toEqual("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
        expect(listeEntrainement.at(1)?.id).toEqual("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const response = await entrainementQuery.listerEntrainement({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })
})
