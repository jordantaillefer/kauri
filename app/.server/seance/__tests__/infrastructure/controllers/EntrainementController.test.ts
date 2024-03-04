import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import { EntrainementBuilder } from "../../../application/EntrainementBuilder"
import { ExerciceEntrainementBuilder } from "../../../application/builders/ExerciceEntrainementBuilder"
import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
import { SerieEntrainementBuilder } from "../../../application/builders/SerieEntrainementBuilder"
import { SerieExerciceSeanceBuilder } from "../../../application/builders/SerieExerciceSeanceBuilder"
import type { EntrainementContrat } from "~/.server/app/contrats/EntrainementContrat"
import { CATEGORIE } from "~/.server/exercice/domain/categorie"
import { creerRequestPourCompteUtilisateur } from "~/.server/testUtils/RequestUtils"
import { SeanceBuilder } from "~/.server/testUtils/builders/SeanceBuilder"

describe("EntrainementController", () => {
  describe("#demarrerEntrainement", () => {
    describe("Cas OK", () => {
      it(
        "doit créer un nouvel entrainement à partir d'une séance",
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const idUtilisateur = testIdGenerator.getId()
          const uuidSeance = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(container, idUtilisateur)

          const serieExerciceSeance1 = new SerieExerciceSeanceBuilder()
            .withRepetitions(8)
            .withPoids(10)
            .build()
          const serieExerciceSeance2 = new SerieExerciceSeanceBuilder()
            .withRepetitions(10)
            .withPoids(15)
            .build()
          const serieExerciceSeance3 = new SerieExerciceSeanceBuilder()
            .withRepetitions(12)
            .withPoids(20)
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
            .withId(uuidSeance)
            .withIdUtilisateur(testIdGenerator.getId())
            .withNomSeance("nomSeance 1")
            .withListeExerciceSeance(exercice1, exercice2)
            .build()
          await container.resolve('seanceRepository').creerSeance(seance)
          const payload = { idSeance: uuidSeance }
          // Act
          const result = await container.resolve('entrainementController').demarrerEntrainement({ request, payload })
          // Assert
          expect(result.reasonPhrase).toEqual(ReasonPhrases.CREATED)
          const nouvelEntrainement = result.data as EntrainementContrat
          expect(nouvelEntrainement.id).toBeDefined()
        })
      )
    })
  })

  describe("#realiserSerie", () => {
    describe("Cas OK", () => {
      it(
        "doit faire passer la série à réalisée",
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const uuidSerieEntrainement1 = testIdGenerator.getId()
          const uuidSerieEntrainement2 = testIdGenerator.getId()
          const uuidEntrainement3 = testIdGenerator.getId()
          const uuidExerciceEntrainement1 = testIdGenerator.getId()
          const uuidExerciceEntrainement2 = testIdGenerator.getId()
          const uuidEntrainement = testIdGenerator.getId()

          const request = await creerRequestPourCompteUtilisateur(container, uuidUtilisateur)

          const serieEntrainement1 = new SerieEntrainementBuilder()
            .withId(uuidSerieEntrainement1)
            .withNombreRepetition(8)
            .withTempsRepos(45)
            .withEstRealise(false)
            .build()
          const serieEntrainement2 = new SerieEntrainementBuilder()
            .withId(uuidSerieEntrainement2)
            .withNombreRepetition(10)
            .withTempsRepos(50)
            .withEstRealise(true)
            .build()
          const serieEntrainement3 = new SerieEntrainementBuilder()
            .withId(uuidEntrainement3)
            .withNombreRepetition(12)
            .withTempsRepos(55)
            .withEstRealise(false)
            .build()
          const exerciceEntrainement1 = new ExerciceEntrainementBuilder()
            .withId(uuidExerciceEntrainement1)
            .withEstRealise(false)
            .withNomExercice("nomExercice 1")
            .withCategorie(CATEGORIE.PECTORAUX)
            .withListeSerieEntrainement(serieEntrainement1)
            .build()
          const exerciceEntrainement2 = new ExerciceEntrainementBuilder()
            .withId(uuidExerciceEntrainement2)
            .withEstRealise(true)
            .withNomExercice("nomExercice 2")
            .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
            .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
            .build()
          const entrainement = new EntrainementBuilder()
            .withId(uuidEntrainement)
            .withNomSeance("nomSeance")
            .withListeExerciceEntrainement(exerciceEntrainement1, exerciceEntrainement2)
            .build()
          await container.resolve('entrainementRepository').creerEntrainement(entrainement)
          const payload = {
            idSerieEntrainement: uuidSerieEntrainement1,
            idExerciceEntrainement: uuidExerciceEntrainement1
          }
          // Act
          const result = await container.resolve('entrainementController').realiserSerie({
            request,
            payload
          })
          // Assert
          expect(result.reasonPhrase).toEqual(ReasonPhrases.NO_CONTENT)
        })
      )
    })
  })
})
