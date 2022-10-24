import { ReasonPhrases } from "http-status-codes"
import { v4 as uuid } from "uuid"
import { describe, expect, it } from "vitest"
import { mockDeep } from "vitest-mock-extended"

import { CompteUtilisateur } from "../../../../authentification/domain/CompteUtilisateur"
import { SessionUtilisateur } from "../../../../authentification/domain/SessionUtilisateur"
import { ProgrammeRepository } from "../../../domain/ports/ProgrammeRepository"
import { ProgrammeController } from "../../../infrastructure/controllers/ProgrammeController"
import { container } from "api"

async function creerRequestPourCompteUtilisateur(idUtilisateur?: string) {
  const request = mockDeep<Request>()
  const sessionManager = container.resolve("sessionManager")
  const session = await sessionManager.get(request)
  session.set("user", SessionUtilisateur.creerSessionUtilisateur({ id: idUtilisateur || uuid() }))

  const headers2 = new Headers({
    "Cookie": await sessionManager.commitSession(session)
  })
  const request2 = mockDeep<Request>({
    headers: headers2
  })
  return request2
}

describe("ProgrammeController", () => {
  let programmeController: ProgrammeController
  let programmeRepository: ProgrammeRepository

  beforeEach(() => {
    programmeController = container.resolve("programmeController")
    programmeRepository = container.resolve("programmeRepository")
  })

  describe("Créer un nouveau programme", () => {
    describe("Quand tout est OK", () => {
      it("doit créer un programme", async () => {
        // Act
        const request2 = await creerRequestPourCompteUtilisateur("idUtilisateur")

        const compteUtilisateurRepository = container.resolve("compteUtilisateurRepository")
        await compteUtilisateurRepository.creerCompteUtilisateur(CompteUtilisateur.creerCompteUtilisateur({ id: "idUtilisateur" }))

        const response = await programmeController.creerProgramme({
          request: request2,
          payload: { nomProgramme: "nomProgramme" }
        })
        console.log(response)
        // Assert
        const listeDeProgrammes = await programmeRepository.recupererTout()

        expect(listeDeProgrammes).toHaveLength(1)

        expect(listeDeProgrammes.at(0)?.idUtilisateur).toEqual("idUtilisateur")
        expect(listeDeProgrammes.at(0)?.nomProgramme).toEqual("nomProgramme")

        expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
      })
    })
    describe("Quand l'utilisateur n'est pas connecté", () => {
      it("doit retourner une erreur Unauthorized", async () => {
        // Arrange
        const request = mockDeep<Request>({})
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
})