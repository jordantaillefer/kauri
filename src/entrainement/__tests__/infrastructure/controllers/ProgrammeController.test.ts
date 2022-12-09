import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { creerRequest, creerRequestPourCompteUtilisateur } from "../../../../testUtils/RequestUtils"
import { ProgrammeBuilder } from "../../../../testUtils/builders/ProgrammeBuilder"
import { SeanceEntrainementBuilder } from "../../../../testUtils/builders/SeanceEntrainementBuilder"
import { Programme } from "../../../domain/Programme"
import { ProgrammeRepository } from "../../../domain/ports/ProgrammeRepository"
import { ProgrammeController } from "../../../infrastructure/controllers/ProgrammeController"
import { container, ProgrammeContrat } from "api"

describe("ProgrammeController", () => {
  let programmeController: ProgrammeController
  let programmeRepository: ProgrammeRepository

  beforeEach(() => {
    programmeController = container.resolve("programmeController")
    programmeRepository = container.resolve("programmeRepository")
  })

  describe("#creerProgramme", () => {
    describe("Cas OK", () => {
      it("doit créer un programme", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")

        // Act
        const response = await programmeController.creerProgramme({
          request,
          payload: { nomProgramme: "nomProgramme" }
        })
        // Assert
        const listeDeProgrammes = await programmeRepository.recupererTout()

        expect(listeDeProgrammes).toHaveLength(1)

        expect(listeDeProgrammes.at(0)?.idUtilisateur).toEqual("idUtilisateur")
        expect(listeDeProgrammes.at(0)?.nomProgramme).toEqual("nomProgramme")

        expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const response = await programmeController.creerProgramme({
          request,
          payload: { nomProgramme: "nomProgramme" }
        })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })

  describe("#listerProgramme", () => {
    describe("Cas OK", () => {
      it("doit lister les programmes pour un utilisateur", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        const programmeAppartenantALUtilisateur = new ProgrammeBuilder()
          .withId("969013bd-6566-434e-94cd-8ec6a6ad6c09")
          .withNomProgramme("nomProgramme")
          .withUserId("idUtilisateur")
          .build()
        const programmeDunAutreUtilisateur = new ProgrammeBuilder()
          .withId("de8de4d5-61a3-4885-a78e-25526f47951e")
          .withNomProgramme("nomProgramme d'un autre utilisateur")
          .withUserId("autreIdUtilisateur")
          .build()
        await programmeRepository.creerProgramme(programmeAppartenantALUtilisateur)
        await programmeRepository.creerProgramme(programmeDunAutreUtilisateur)

        // Act
        const response = await programmeController.listerProgramme({ request, payload: {} })

        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const listeDeProgrammes = response.data as ProgrammeContrat[]
        expect(response.data).toHaveLength(1)

        expect(listeDeProgrammes.at(0)?.id).toEqual("969013bd-6566-434e-94cd-8ec6a6ad6c09")
        expect(listeDeProgrammes.at(0)?.nomProgramme).toEqual("nomProgramme")
      })
    })
  })

  describe("#recupererDetail", () => {
    describe("Cas OK", () => {
      it("doit récupérer le programme de l'utilisateur", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        const programmeAppartenantALUtilisateur = new ProgrammeBuilder()
          .withId("969013bd-6566-434e-94cd-8ec6a6ad6c09")
          .withNomProgramme("nomProgramme")
          .withUserId("idUtilisateur")
          .build()
        const programmeDunAutreUtilisateur = new ProgrammeBuilder()
          .withId("de8de4d5-61a3-4885-a78e-25526f47951e")
          .withNomProgramme("nomProgramme d'un autre utilisateur")
          .withUserId("autreIdUtilisateur")
          .build()
        await programmeRepository.creerProgramme(programmeAppartenantALUtilisateur)
        await programmeRepository.creerProgramme(programmeDunAutreUtilisateur)

        // Act
        const response = await programmeController.recupererDetail({
          request, payload: {
            idProgramme: "969013bd-6566-434e-94cd-8ec6a6ad6c09"
          }
        })

        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const listeDeProgrammes = response.data as Programme

        expect(listeDeProgrammes.id).toEqual("969013bd-6566-434e-94cd-8ec6a6ad6c09")
        expect(listeDeProgrammes.nomProgramme).toEqual("nomProgramme")
      })

    })
    describe("Cas KO", () => {
      it("quand le programme n'existe pas, retourne NOT_FOUND", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        const programmeAppartenantALUtilisateur = new ProgrammeBuilder()
          .withId("969013bd-6566-434e-94cd-8ec6a6ad6c09")
          .withNomProgramme("nomProgramme")
          .withUserId("idUtilisateur")
          .build()
        const programmeDunAutreUtilisateur = new ProgrammeBuilder()
          .withId("de8de4d5-61a3-4885-a78e-25526f47951e")
          .withNomProgramme("nomProgramme d'un autre utilisateur")
          .withUserId("autreIdUtilisateur")
          .build()
        await programmeRepository.creerProgramme(programmeAppartenantALUtilisateur)
        await programmeRepository.creerProgramme(programmeDunAutreUtilisateur)

        // Act
        const response = await programmeController.recupererDetail({
          request, payload: {
            idProgramme: "969013bd-6566-434e-94cd-aaaaaaaaa"
          }
        })

        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.NOT_FOUND)
      })

      it("quand le programme n'appartient pas à l'utilisateur, retourne NOT_AUTHORIZED", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        const programmeAppartenantALUtilisateur = new ProgrammeBuilder()
          .withId("969013bd-6566-434e-94cd-8ec6a6ad6c09")
          .withNomProgramme("nomProgramme")
          .withUserId("idUtilisateur")
          .build()
        const programmeDunAutreUtilisateur = new ProgrammeBuilder()
          .withId("de8de4d5-61a3-4885-a78e-25526f47951e")
          .withNomProgramme("nomProgramme d'un autre utilisateur")
          .withUserId("autreIdUtilisateur")
          .build()
        await programmeRepository.creerProgramme(programmeAppartenantALUtilisateur)
        await programmeRepository.creerProgramme(programmeDunAutreUtilisateur)

        // Act
        const response = await programmeController.recupererDetail({
          request, payload: {
            idProgramme: "de8de4d5-61a3-4885-a78e-25526f47951e"
          }
        })

        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.NOT_FOUND)
      })
    })
  })
})