import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { creerRequest, creerRequestPourCompteUtilisateur } from "../../../../testUtils/RequestUtils"
import { ProgrammeBuilder } from "../../../../testUtils/builders/ProgrammeBuilder"
import { SeanceEntrainementBuilder } from "../../../../testUtils/builders/SeanceEntrainementBuilder"
import { SeanceEntrainement } from "../../../domain/SeanceEntrainement"
import { container } from "api"

describe("SeanceEntrainementController", () => {
  describe("#creerSeanceEntrainement", () => {
    describe("Cas OK", () => {
      it("doit creer une seance d'entrainement", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")

        const programmeRepository = await container.resolve("programmeRepository")
        const programme = new ProgrammeBuilder()
          .withId("309d71ff-184f-437c-a9ec-c51e13a66cfd")
          .withUserId("idUtilisateur")
          .build()
        await programmeRepository.creerProgramme(programme)

        const seanceEntrainementController = await container.resolve("seanceEntrainementController")
        // Act
        const result = await seanceEntrainementController.creerSeanceEntrainement({
          request,
          payload: { idProgramme: "309d71ff-184f-437c-a9ec-c51e13a66cfd" }
        })
        // Assert
        expect(result.reasonPhrase).toEqual(ReasonPhrases.CREATED)
      })
    })
  })

  describe("#listerSeanceEntrainement", () => {
    describe("Cas OK", () => {
      it("doit lister les seances d'entrainements", async () => {
        // Arrange

        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")

        const programmeRepository = await container.resolve("programmeRepository")
        const programme = new ProgrammeBuilder()
          .withId("309d71ff-184f-437c-a9ec-c51e13a66cfd")
          .withUserId("idUtilisateur")
          .withSeancesEntrainement(
            new SeanceEntrainementBuilder()
              .withId("518a5f8a-045f-44bc-a41f-85cfcea227d8")
              .withDateSeance("1997-03-8")
              .build(),
            new SeanceEntrainementBuilder()
              .withId("4fda6f55-9316-4c41-abca-9f2064f8ea08")
              .withDateSeance("1993-06-12")
              .build()
          )
          .build()

        await programmeRepository.creerProgramme(programme)

        const seanceEntrainementController = await container.resolve("seanceEntrainementController")
        // Act
        const result = await seanceEntrainementController.listerSeanceEntrainement({
          request,
          payload: {
            idProgramme: "309d71ff-184f-437c-a9ec-c51e13a66cfd"
          }
        })
        // Assert
        expect(result.reasonPhrase).toEqual(ReasonPhrases.OK)

        const listeSeanceEntrainement = result.data as SeanceEntrainement[]
        expect(listeSeanceEntrainement).toHaveLength(2)
        expect(listeSeanceEntrainement.at(0)?.id).toEqual("4fda6f55-9316-4c41-abca-9f2064f8ea08")
        expect(listeSeanceEntrainement.at(0)?.dateSeance).toEqual("12/06/1993")
        expect(listeSeanceEntrainement.at(1)?.id).toEqual("518a5f8a-045f-44bc-a41f-85cfcea227d8")
        expect(listeSeanceEntrainement.at(1)?.dateSeance).toEqual("08/03/1997")
      })
    })
  })

  describe("#supprimerSeanceEntrainement", () => {
    it("doit supprimer la seance d'entrainement", async () => {
      // Arrange
      const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
      const programme1 = new ProgrammeBuilder()
        .withId("59aafaf0-8932-4749-912f-3015e16b70c4")
        .withSeancesEntrainement(
          new SeanceEntrainementBuilder()
            .withId("ddd4b28d-3a6b-4a88-b0f1-51c884ac7c14")
            .build(),
          new SeanceEntrainementBuilder()
            .withId("0e37e050-dda7-4219-8f69-16f020be445a")
            .build()
        )
        .build()
      const programme2 = new ProgrammeBuilder()
        .withId("fcde2c6d-3787-4c33-9731-ba1e91f2d710")
        .withSeancesEntrainement(
          new SeanceEntrainementBuilder()
            .withId("e5141ecd-80ed-4fa0-b884-56b75e7e4f52")
            .build()
        )
        .build()
      const programmeRepository = await container.resolve("programmeRepository")
      const seanceEntrainementController = await container.resolve("seanceEntrainementController")
      await programmeRepository.creerProgramme(programme1)
      await programmeRepository.creerProgramme(programme2)

      // Act
      const result = await seanceEntrainementController.supprimerSeanceEntrainement({
        request,
        payload: { idSeanceEntrainement: "0e37e050-dda7-4219-8f69-16f020be445a" }
      })
      // Assert
      expect(result.reasonPhrase).toEqual(ReasonPhrases.NO_CONTENT)
    })
  })
})