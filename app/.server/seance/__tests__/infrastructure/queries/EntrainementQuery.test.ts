import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import { EntrainementBuilder } from "../../../application/EntrainementBuilder"
import { ExerciceEntrainementBuilder } from "../../../application/builders/ExerciceEntrainementBuilder"
import { SerieEntrainementBuilder } from "../../../application/builders/SerieEntrainementBuilder"
import type { Entrainement } from "../../../domain/Entrainement"
import type { EntrainementRepository } from "../../../domain/ports/EntrainementRepository"
import { container } from "@/api/index.server"
import type { DetailEntrainementContrat, EntrainementContrat } from "~/.server/app/contrats/EntrainementContrat"
import { CATEGORIE } from "~/.server/exercice/domain/categorie"
import type { EntrainementQuery } from "~/.server/seance/infrastructure/queries/EntrainementQuery"
import { creerRequest, creerRequestPourCompteUtilisateur } from "~/.server/testUtils/RequestUtils"

describe("EntrainementQuery", () => {
  let entrainementQuery: EntrainementQuery
  let entrainementRepository: EntrainementRepository

  beforeEach(() => {
    entrainementQuery = container.resolve("entrainementQuery")
    entrainementRepository = container.resolve("entrainementRepository")
  })

  describe("#recuperEntrainementParId", () => {
    describe("Cas OK", () => {
      it(
        "quand l'entrainement existe, doit récupérer l'entrainement",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur)
          const uuidSerieEntrainement1 = testIdGenerator.getId()
          const uuidSerieEntrainement2 = testIdGenerator.getId()
          const uuidSerieEntrainement3 = testIdGenerator.getId()
          const uuidExerciceEntrainement1 = testIdGenerator.getId()
          const uuidExerciceEntrainement2 = testIdGenerator.getId()
          const uuidEntrainement = testIdGenerator.getId()

          const serieEntrainement1 = new SerieEntrainementBuilder()
            .withId(uuidSerieEntrainement1)
            .withNombreRepetition(8)
            .withTempsRepos(45)
            .withOrdre(1)
            .withEstRealise(false)
            .build()
          const serieEntrainement2 = new SerieEntrainementBuilder()
            .withId(uuidSerieEntrainement2)
            .withNombreRepetition(10)
            .withTempsRepos(50)
            .withOrdre(1)
            .withEstRealise(true)
            .build()
          const serieEntrainement3 = new SerieEntrainementBuilder()
            .withId(uuidSerieEntrainement3)
            .withNombreRepetition(12)
            .withTempsRepos(55)
            .withOrdre(2)
            .withEstRealise(false)
            .build()
          const exerciceSeance1 = new ExerciceEntrainementBuilder()
            .withId(uuidExerciceEntrainement1)
            .withEstRealise(false)
            .withNomExercice("nomExercice 1")
            .withOrdre(1)
            .withCategorie(CATEGORIE.PECTORAUX)
            .withListeSerieEntrainement(serieEntrainement1)
            .build()
          const exerciceSeance2 = new ExerciceEntrainementBuilder()
            .withId(uuidExerciceEntrainement2)
            .withEstRealise(true)
            .withNomExercice("nomExercice 2")
            .withOrdre(2)
            .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
            .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
            .build()
          const entrainement = new EntrainementBuilder()
            .withId(uuidEntrainement)
            .withNomSeance("nomSeance")
            .withListeExerciceEntrainement(exerciceSeance1, exerciceSeance2)
            .build()
          await entrainementRepository.creerEntrainement(entrainement)
          const payload = { idEntrainement: uuidEntrainement }

          // Act
          const result = await entrainementQuery.recupererEntrainementParId({
            request,
            payload
          })

          // Assert
          expect(result.reasonPhrase).toEqual(ReasonPhrases.OK)
          const entrainementResult = result.data as DetailEntrainementContrat
          expect(entrainementResult.id).toEqual(uuidEntrainement)
          expect(entrainementResult.nomSeance).toEqual("nomSeance")
          expect(entrainementResult.listeExerciceEntrainement).toHaveLength(2)
          expect(entrainementResult.listeExerciceEntrainement.at(0)?.id).toEqual(uuidExerciceEntrainement1)
          expect(entrainementResult.listeExerciceEntrainement.at(0)?.estRealise).toEqual(false)
          expect(entrainementResult.listeExerciceEntrainement.at(0)?.nomExercice).toEqual("nomExercice 1")
          expect(entrainementResult.listeExerciceEntrainement.at(0)?.ordre).toEqual(1)
          expect(entrainementResult.listeExerciceEntrainement.at(0)?.categorie).toEqual("Pectoraux")
          expect(entrainementResult.listeExerciceEntrainement.at(0)?.series).toHaveLength(1)
          expect(entrainementResult.listeExerciceEntrainement.at(0)?.series.at(0)?.id).toEqual(
            uuidSerieEntrainement1
          )
          expect(
            entrainementResult.listeExerciceEntrainement.at(0)?.series.at(0)?.repetitions
          ).toEqual(8)
          expect(
            entrainementResult.listeExerciceEntrainement.at(0)?.series.at(0)?.tempsRepos
          ).toEqual(45)
          expect(entrainementResult.listeExerciceEntrainement.at(0)?.series.at(0)?.ordre).toEqual(1)
          expect(entrainementResult.listeExerciceEntrainement.at(0)?.series.at(0)?.estRealise).toEqual(
            false
          )
          expect(entrainementResult.listeExerciceEntrainement.at(1)?.id).toEqual(uuidExerciceEntrainement2)
          expect(entrainementResult.listeExerciceEntrainement.at(1)?.estRealise).toEqual(true)
          expect(entrainementResult.listeExerciceEntrainement.at(1)?.nomExercice).toEqual("nomExercice 2")
          expect(entrainementResult.listeExerciceEntrainement.at(1)?.ordre).toEqual(2)
          expect(entrainementResult.listeExerciceEntrainement.at(1)?.categorie).toEqual("Ischio-jambiers")
          expect(entrainementResult.listeExerciceEntrainement.at(1)?.series).toHaveLength(2)
          expect(entrainementResult.listeExerciceEntrainement.at(1)?.series.at(0)?.id).toEqual(
            uuidSerieEntrainement2
          )
          expect(
            entrainementResult.listeExerciceEntrainement.at(1)?.series.at(0)?.repetitions
          ).toEqual(10)
          expect(
            entrainementResult.listeExerciceEntrainement.at(1)?.series.at(0)?.tempsRepos
          ).toEqual(50)
          expect(entrainementResult.listeExerciceEntrainement.at(1)?.series.at(0)?.ordre).toEqual(1)
          expect(entrainementResult.listeExerciceEntrainement.at(1)?.series.at(0)?.estRealise).toEqual(
            true
          )
          expect(entrainementResult.listeExerciceEntrainement.at(1)?.series.at(1)?.id).toEqual(
            uuidSerieEntrainement3
          )
          expect(
            entrainementResult.listeExerciceEntrainement.at(1)?.series.at(1)?.repetitions
          ).toEqual(12)
          expect(
            entrainementResult.listeExerciceEntrainement.at(1)?.series.at(1)?.tempsRepos
          ).toEqual(55)
          expect(entrainementResult.listeExerciceEntrainement.at(1)?.series.at(1)?.ordre).toEqual(2)
          expect(entrainementResult.listeExerciceEntrainement.at(1)?.series.at(1)?.estRealise).toEqual(
            false
          )
        })
      )
    })
  })

  describe("#listerEntrainement", () => {
    describe("Cas OK", () => {
      it(
        "doit récupérer la liste des séances de l'utilisateur",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const uuidEntrainement1 = testIdGenerator.getId()
          const uuidEntrainement2 = testIdGenerator.getId()
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur)

          const entrainementUtilisateur1: Entrainement = new EntrainementBuilder()
            .withId(uuidEntrainement1)
            .withNomSeance("Seance 1")
            .withIdUtilisateur(uuidUtilisateur)
            .build()
          const entrainementUtilisateur2: Entrainement = new EntrainementBuilder()
            .withId(uuidEntrainement2)
            .withNomSeance("Seance 2")
            .withIdUtilisateur(uuidUtilisateur)
            .build()
          const entrainementAutreUtilisateur: Entrainement = new EntrainementBuilder()
            .withId(testIdGenerator.getId())
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
          expect(listeEntrainement.at(0)?.id).toEqual(uuidEntrainement1)
          expect(listeEntrainement.at(1)?.id).toEqual(uuidEntrainement2)
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
          const response = await entrainementQuery.listerEntrainement({ request })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
        })
      )
    })
  })
})
