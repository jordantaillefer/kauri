import { v4 as uuid } from "uuid"
import { DeepMockProxy, mockDeep } from "vitest-mock-extended"

import { CompteUtilisateur } from "../authentification/domain/CompteUtilisateur"
import { SessionUtilisateur } from "../authentification/domain/SessionUtilisateur"
import { container } from "api"

export async function creerRequestPourCompteUtilisateur(idUtilisateur?: string) {
  const id = idUtilisateur || uuid()
  const compteUtilisateurRepository = container.resolve("compteUtilisateurRepository")
  await compteUtilisateurRepository.creerCompteUtilisateur(CompteUtilisateur.creerCompteUtilisateur({ id }))
  return creerRequestAvecSession(id)
}
export async function creerRequestAvecSession(idUtilisateur?: string): Promise<DeepMockProxy<Request>> {
  const id = idUtilisateur || uuid()
  const initialRequest = mockDeep<Request>()
  const sessionManager = container.resolve("sessionManager")
  const session = await sessionManager.get(initialRequest)
  session.set("user", SessionUtilisateur.creerSessionUtilisateur({ id }))

  const headers = new Headers({
    "Cookie": await sessionManager.commitSession(session)
  })
  return mockDeep<Request>({
    headers
  })
}

export function creerRequest() {
  return mockDeep<Request>()
}