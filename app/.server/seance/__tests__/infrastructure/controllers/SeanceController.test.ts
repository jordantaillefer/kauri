import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import type { Seance } from "../../../domain/Seance"
import type { SeanceRepository } from "../../../domain/ports/SeanceRepository"
import type { SeanceController } from "../../../infrastructure/controllers/SeanceController"
import type { SeanceContrat } from "@/api/index.server"
import { container } from "@/api/index.server"
import { creerRequest, creerRequestPourCompteUtilisateur } from "~/.server/testUtils/RequestUtils"
import { SeanceBuilder } from "~/.server/testUtils/builders/SeanceBuilder"
import { ExerciceSeanceBuilder } from "@/api/seance/application/builders/ExerciceSeanceBuilder"
import { prisma } from "@/api/db/prisma"

describe("SeanceController", () => {
  let seanceController: SeanceController
  let seanceRepository: SeanceRepository

  beforeEach(() => {
    seanceController = container.resolve("seanceController")
    seanceRepository = container.resolve("seanceRepository")
  })

  describe("#initialiserSeance", () => {
    describe("Cas OK", () => {
      it(
        "doit initialiser une seance",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur)

          // Act
          const response = await seanceController.initialiserSeance({ request })

          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
          const nouvelleSeance = response.data as SeanceContrat
          expect(nouvelleSeance).toBeDefined()
          expect(nouvelleSeance.nomSeance).toEqual("Nouvelle séance")
        })
      )
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

  describe("#mettreAJourNomSeance", () => {
    describe("Cas OK", () => {
      it(
        "doit mettre à jour le nom de la séance",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const uuidUtilisateur = testIdGenerator.getId()
          const uuidSeance1 = testIdGenerator.getId()

          const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur)
          const seanceUtilisateur1: Seance = new SeanceBuilder()
            .withId(uuidSeance1)
            .withIdUtilisateur(uuidUtilisateur)
            .withNomSeance("Seance 1")
            .build()
          const seanceAutreUtilisateur: Seance = new SeanceBuilder()
            .withId(testIdGenerator.getId())
            .withIdUtilisateur(testIdGenerator.getId())
            .build()
          await seanceRepository.creerSeance(seanceUtilisateur1)
          await seanceRepository.creerSeance(seanceAutreUtilisateur)
          // Act
          const payload = { idSeance: uuidSeance1, nomSeance: "nouveau nom seance 1" }
          const response = await seanceController.mettreAJourNomSeance({ request, payload })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.NO_CONTENT)
        })
      )
    })
  })

  describe("#dupliquerSeance", () => {
    describe("Cas OK", () => {
      it(
        "doit dupliquer la séance",
        integrationTestFunction(async ({ testIdGenerator }) => {
          // Arrange
          const uuidExerciceSeance = testIdGenerator.getId()
          const uuidUtilisateur = testIdGenerator.getId()
          const uuidUtilisateur2 = testIdGenerator.getId()
          const uuidSeance = testIdGenerator.getId()

          const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur)

          const exerciceSeance = new ExerciceSeanceBuilder().withId(uuidExerciceSeance).withOrdre(1).build()
          const seance: Seance = new SeanceBuilder()
            .withId(uuidSeance)
            .withNomSeance(uuidUtilisateur2)
            .withIdUtilisateur(uuidUtilisateur2)
            .withListeExerciceSeance(exerciceSeance)
            .build()
          await seanceRepository.creerSeance(seance)
          // Act
          const payload = { idSeance: uuidSeance }
          const response = await seanceController.dupliquerSeance({ request, payload })
          // Assert
          expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
          const listeSeanceResult = await prisma.seance.findMany({
            where: {
              idUtilisateur: uuidUtilisateur
            }
          })

          expect(listeSeanceResult).toHaveLength(1)
          expect(listeSeanceResult.at(0)?.nomSeance).toEqual(`Séance dupliqué depuis : ${seance.nomSeance}`)
        })
      )
    })
  })
})
