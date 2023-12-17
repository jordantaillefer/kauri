import { creerRequestPourCompteUtilisateur } from "@/api/testUtils/RequestUtils"
import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import { ReasonPhrases } from "http-status-codes"
import { ExerciceSeanceBuilder } from "@/api/seance/application/builders/ExerciceSeanceBuilder"
import type { Seance } from "@/api/seance/domain/Seance"
import { SeanceBuilder } from "@/api/testUtils/builders/SeanceBuilder"
import { prisma } from "@/api/db/prisma"
import type { SeanceExplorationContrat } from "@/api/app/contrats/SeanceExplorationContrat"
import { SeanceExplorationQuery } from "@/api/exploration/infrastructure/queries/SeanceExplorationQuery"
import { anyString } from "vitest-mock-extended"

describe("SeanceExplorationQuery", () => {
  let seanceExplorationQuery: SeanceExplorationQuery

  beforeEach(() => {
    seanceExplorationQuery = new SeanceExplorationQuery()
  })

  it(
    "quand il n'existe existe une séance pour plusieurs utilisateur, doit remonter la liste des séances",
    integrationTestFunction(async ({ testIdGenerator }) => {
      // Arrange
      const uuidUtilisateur = testIdGenerator.getId()
      const uuidUtilisateur2 = testIdGenerator.getId()
      const uuidSeance1 = testIdGenerator.getId()
      const uuidSeance2 = testIdGenerator.getId()
      const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur)
      await creerRequestPourCompteUtilisateur(uuidUtilisateur2, "Doe", "Jane")

      const exerciceSeance1 = new ExerciceSeanceBuilder()
        .withId(testIdGenerator.getId())
        .withOrdre(1)
        .withIdSeance(uuidSeance1)
        .build()
      const exerciceSeance2 = new ExerciceSeanceBuilder()
        .withId(testIdGenerator.getId())
        .withOrdre(2)
        .withIdSeance(uuidSeance1)
        .build()
      const exerciceSeance3 = new ExerciceSeanceBuilder()
        .withId(testIdGenerator.getId())
        .withOrdre(1)
        .withIdSeance(uuidSeance2)
        .build()
      const seance: Seance = new SeanceBuilder()
        .withId(uuidSeance1)
        .withIdUtilisateur(uuidUtilisateur)
        .withNomSeance("nom seance 1")
        .withListeExerciceSeance(exerciceSeance1, exerciceSeance2)
        .build()
      const seance2: Seance = new SeanceBuilder()
        .withId(uuidSeance2)
        .withIdUtilisateur(uuidUtilisateur2)
        .withNomSeance("nom seance 2")
        .withListeExerciceSeance(exerciceSeance3)
        .build()

      await prisma.seance.createMany({
        data: [seance, seance2].map(seanceACreer => ({
          id: seanceACreer.id,
          nomSeance: seanceACreer.nomSeance,
          idUtilisateur: seanceACreer.idUtilisateur
        }))
      })
      await prisma.exerciceSeance.createMany({
        data: [exerciceSeance1, exerciceSeance2, exerciceSeance3].map(exerciceSeanceACreer => ({
          id: exerciceSeanceACreer.id,
          ordre: exerciceSeanceACreer.ordre,
          categorie: exerciceSeanceACreer.categorie,
          idExercice: exerciceSeanceACreer.idExercice,
          nomExercice: exerciceSeanceACreer.nomExercice,
          idSeance: exerciceSeanceACreer.idSeance
        }))
      })

      // Act
      const response = await seanceExplorationQuery.listerSeanceExploration({ request })

      // Assert
      expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
      expect(response.data).toHaveLength(2)
      const listeSeanceResult = response.data as SeanceExplorationContrat[]
      expect(listeSeanceResult).toContainEqual({
        id: anyString(),
        nomSeance: "nom seance 1",
        nomUtilisateur: "John Doe",
        nombreExercicesSeance: 2
      })
      expect(listeSeanceResult).toContainEqual({
        id: anyString(),
        nomSeance: "nom seance 2",
        nomUtilisateur: "Jane Doe",
        nombreExercicesSeance: 1
      })
    })
  )
})
