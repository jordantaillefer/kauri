import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import { ExerciceBuilder } from "../../../application/builders/ExerciceBuilder"
import { prisma } from "~/.server/db/prisma"
import { CATEGORIE } from "~/.server/exercice/domain/categorie"
import { creerRequest, creerRequestPourCompteUtilisateur } from "~/.server/testUtils/RequestUtils"
import { SeanceBuilder } from "~/.server/testUtils/builders/SeanceBuilder"
import type { ExerciceSeance } from "@/api/seance/domain/ExerciceSeance";
import { ExerciceSeanceBuilder } from "@/api/seance/application/builders/ExerciceSeanceBuilder";
import { SerieExerciceSeanceBuilder } from "@/api/seance/application/builders/SerieExerciceSeanceBuilder";
import { ExerciceSeanceContrat } from "@/api/app/contrats"

describe("ExerciceSeanceController", () => {
  describe("#créerExerciceSeance", () => {
    describe("Cas OK", () => {
      it(
        "doit créer un nouvel exercice pour une séance",
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const uuidExercice1 = testIdGenerator.getId()
          const uuidSeance1 = testIdGenerator.getId()
          const uuidUtilisateur = testIdGenerator.getId()

          const request = await creerRequestPourCompteUtilisateur(container, uuidUtilisateur)
          const seance = new SeanceBuilder().withId(uuidSeance1).withIdUtilisateur(testIdGenerator.getId()).build()
          const exercice = new ExerciceBuilder()
            .withId(uuidExercice1)
            .withNomExercice("nomExercice")
            .withCategorie(CATEGORIE.ABDOMINAUX)
            .build()
          await container.resolve('seanceExerciceRepository').creerExercice(exercice)
          await container.resolve('seanceRepository').creerSeance(seance)
          const payload = {
            idSeance: uuidSeance1,
            idExercice: uuidExercice1,
            tempsRepos: 2,
            series: [{ repetitions: 2, tempsRepos: 45, poids: 20}, { repetitions: 1, tempsRepos: 50, poids: 22}, { repetitions: 3, tempsRepos: 55, poids: 24}]
          }

          // Act
          const response = await container.resolve('exerciceSeanceController').creerExerciceSeance({ request, payload })

          // Assert
          const listeExerciceSeances = await prisma.exerciceSeance.findMany({
            include: {
              serieExerciceSeances: true
            },
            where: {
              idSeance: uuidSeance1
            }
          })
          expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
          expect(listeExerciceSeances.at(0)?.idSeance).toEqual(uuidSeance1)
          expect(listeExerciceSeances.at(0)?.idExercice).toEqual(uuidExercice1)
          expect(listeExerciceSeances.at(0)?.nomExercice).toEqual("nomExercice")
          expect(listeExerciceSeances.at(0)?.categorie).toEqual(CATEGORIE.ABDOMINAUX)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances).toHaveLength(3)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(0)?.ordre).toEqual(1)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(0)?.repetitions).toEqual(2)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(0)?.poids).toEqual(20)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(0)?.tempsRepos).toEqual(45)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(1)?.ordre).toEqual(2)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(1)?.repetitions).toEqual(1)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(1)?.poids).toEqual(22)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(1)?.tempsRepos).toEqual(50)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(2)?.ordre).toEqual(3)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(2)?.repetitions).toEqual(3)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(2)?.poids).toEqual(24)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(2)?.tempsRepos).toEqual(55)
          const nouveauExerciceSeance = response.data as ExerciceSeanceContrat
          expect(nouveauExerciceSeance).toBeDefined()
          expect(nouveauExerciceSeance.nomExercice).toEqual("nomExercice")
        })
      )
    })
    describe("Cas KO", () => {
      it(
        "Quand l'utilisateur n'est pas connecté, erreur Unauthorized",
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const request = creerRequest()
          const payload = { idSeance: testIdGenerator.getId(), idExercice: testIdGenerator.getId(), tempsRepos: 2, series: [] }

          // Act
          const response = await container.resolve('exerciceSeanceController').creerExerciceSeance({ request, payload })

          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
        })
      )
    })
  })

  describe("#modifierExerciceSeance", () => {
    describe("Cas OK", () => {
      it(
        "doit modifier l'exercice pour une séance",
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const uuidExerciceSeance = testIdGenerator.getId()
          const uuidExercice1 = testIdGenerator.getId()
          const uuidExercice2 = testIdGenerator.getId()
          const uuidSeance1 = testIdGenerator.getId()
          const uuidUtilisateur = testIdGenerator.getId()

          const request = await creerRequestPourCompteUtilisateur(container, uuidUtilisateur)
          const serieExerciceSeance = new SerieExerciceSeanceBuilder()
            .withRepetitions(12)
            .withTempsRepos(30)
            .withPoids(32)
            .build()

          const exerciceSeance: ExerciceSeance = new ExerciceSeanceBuilder()
            .withId(uuidExerciceSeance)
            .withIdSeance(uuidSeance1)
            .withIdExercice(uuidExercice1)
            .withNomExercice("nomExercice")
            .withCategorie(CATEGORIE.ABDOMINAUX)
            .withListeSerieExerciceSeance(serieExerciceSeance)
            .build()
          const seance = new SeanceBuilder()
            .withId(uuidSeance1)
            .withIdUtilisateur(testIdGenerator.getId())
            .build()
          const exercice = new ExerciceBuilder()
            .withId(uuidExercice1)
            .withNomExercice("nomExercice")
            .withCategorie(CATEGORIE.ABDOMINAUX)
            .build()
          const exercice2 = new ExerciceBuilder()
            .withId(uuidExercice2)
            .withNomExercice("nomExercice 2")
            .withCategorie(CATEGORIE.PECTORAUX)
            .build()
          await container.resolve('seanceExerciceRepository').creerExercice(exercice)
          await container.resolve('seanceExerciceRepository').creerExercice(exercice2)
          await container.resolve('seanceRepository').creerSeance(seance)
          await container.resolve('seanceRepository').ajouterExerciceSeanceASeance(uuidSeance1, exerciceSeance);
          const payload = {
            idSeance: uuidSeance1,
            idExerciceSeance: uuidExerciceSeance,
            idExercice: uuidExercice2,
            series: [{ repetitions: 2, tempsRepos: 45, poids: 20}, { repetitions: 1, tempsRepos: 50, poids: 22}, { repetitions: 3, tempsRepos: 55, poids: 24}]
          }

          // Act
          const response = await container.resolve('exerciceSeanceController').modifierExerciceSeance({ request, payload })

          // Assert
          const listeExerciceSeances = await prisma.exerciceSeance.findMany({
            include: {
              serieExerciceSeances: true
            },
            where: {
              idSeance: uuidSeance1
            }
          })
          expect(response.reasonPhrase).toEqual(ReasonPhrases.NO_CONTENT)
          expect(listeExerciceSeances.at(0)?.idSeance).toEqual(uuidSeance1)
          expect(listeExerciceSeances.at(0)?.idExercice).toEqual(uuidExercice2)
          expect(listeExerciceSeances.at(0)?.nomExercice).toEqual("nomExercice 2")
          expect(listeExerciceSeances.at(0)?.categorie).toEqual(CATEGORIE.PECTORAUX)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances).toHaveLength(3)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(0)?.ordre).toEqual(1)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(0)?.repetitions).toEqual(2)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(0)?.tempsRepos).toEqual(45)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(0)?.poids).toEqual(20)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(1)?.ordre).toEqual(2)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(1)?.repetitions).toEqual(1)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(1)?.tempsRepos).toEqual(50)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(1)?.poids).toEqual(22)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(2)?.ordre).toEqual(3)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(2)?.repetitions).toEqual(3)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(2)?.tempsRepos).toEqual(55)
          expect(listeExerciceSeances.at(0)?.serieExerciceSeances.at(2)?.poids).toEqual(24)
        })
      )
    })
    describe("Cas KO", () => {
      it(
        "Quand l'utilisateur n'est pas connecté, erreur Unauthorized",
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const request = creerRequest()
          const payload = { idSeance: testIdGenerator.getId(), idExerciceSeance: testIdGenerator.getId(), idExercice: testIdGenerator.getId(), tempsRepos: 2, series: [] }

          // Act
          const response = await container.resolve('exerciceSeanceController').modifierExerciceSeance({ request, payload })

          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
        })
      )
    })
  })

  describe("#supprimerExerciceSeance", () => {
    describe("Cas OK", () => {
      it(
        "doit supprimer l'exercice pour une séance",
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const uuidExerciceSeance = testIdGenerator.getId()
          const uuidExercice1 = testIdGenerator.getId()
          const uuidExercice2 = testIdGenerator.getId()
          const uuidSeance1 = testIdGenerator.getId()
          const uuidUtilisateur = testIdGenerator.getId()

          const request = await creerRequestPourCompteUtilisateur(container, uuidUtilisateur)
          const serieExerciceSeance = new SerieExerciceSeanceBuilder().withRepetitions(12).withTempsRepos(30).build()

          const exerciceSeance: ExerciceSeance = new ExerciceSeanceBuilder()
            .withId(uuidExerciceSeance)
            .withIdSeance(uuidSeance1)
            .withIdExercice(uuidExercice1)
            .withNomExercice("nomExercice")
            .withCategorie(CATEGORIE.ABDOMINAUX)
            .withListeSerieExerciceSeance(serieExerciceSeance)
            .build()
          const seance = new SeanceBuilder()
            .withId(uuidSeance1)
            .withIdUtilisateur(testIdGenerator.getId())
            .build()
          const exercice = new ExerciceBuilder()
            .withId(uuidExercice1)
            .withNomExercice("nomExercice")
            .withCategorie(CATEGORIE.ABDOMINAUX)
            .build()
          const exercice2 = new ExerciceBuilder()
            .withId(uuidExercice2)
            .withNomExercice("nomExercice 2")
            .withCategorie(CATEGORIE.PECTORAUX)
            .build()
          await container.resolve('seanceExerciceRepository').creerExercice(exercice)
          await container.resolve('seanceExerciceRepository').creerExercice(exercice2)
          await container.resolve('seanceRepository').creerSeance(seance)
          await container.resolve('seanceRepository').ajouterExerciceSeanceASeance(uuidSeance1, exerciceSeance);
          const payload = {
            idExerciceSeance: uuidExerciceSeance,
          }

          // Act
          const response = await container.resolve('exerciceSeanceController').supprimerExerciceSeance({ request, payload })

          // Assert
          const listeExerciceSeances = await prisma.exerciceSeance.findMany({
            include: {
              serieExerciceSeances: true
            },
            where: {
              idSeance: uuidSeance1
            }
          })
          expect(response.reasonPhrase).toEqual(ReasonPhrases.NO_CONTENT)
          expect(listeExerciceSeances).toHaveLength(0)
        })
      )
    })
    describe("Cas KO", () => {
      it(
        "Quand l'utilisateur n'est pas connecté, erreur Unauthorized",
        integrationTestFunction(async ({ testIdGenerator, container }) => {
          // Arrange
          const request = creerRequest()
          const payload = { idExerciceSeance: testIdGenerator.getId() }

          // Act
          const response = await container.resolve('exerciceSeanceController').supprimerExerciceSeance({ request, payload })

          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
        })
      )
    })
  })
})
