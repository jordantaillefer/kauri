import { randomUUID } from "crypto";
import type { DeepMockProxy} from "vitest-mock-extended";
import { mockDeep } from "vitest-mock-extended"

import { CompteUtilisateur } from "../authentification/domain/CompteUtilisateur"
import { SessionUtilisateur } from "../authentification/domain/SessionUtilisateur"
import { container } from "app/server"

export async function creerRequestPourCompteUtilisateur(idUtilisateur?: string, nomUtilisateur?: string, prenomUtilisateur?: string) {
  const id = idUtilisateur || randomUUID()
  const nom = nomUtilisateur || "Doe"
  const prenom = prenomUtilisateur || "John"
  const compteUtilisateurRepository = container.resolve("compteUtilisateurRepository")
  await compteUtilisateurRepository.creerCompteUtilisateur(CompteUtilisateur.creerCompteUtilisateur({ id, nom, prenom }))
  return creerRequestAvecSession(id)
}
export async function creerRequestAvecSession(idUtilisateur?: string, nomUtilisateur?: string, prenomUtilisateur?: string): Promise<DeepMockProxy<Request>> {
  const id = idUtilisateur || randomUUID()
  const nom = nomUtilisateur || "Doe"
  const prenom = prenomUtilisateur || "John"
  const initialRequest = mockDeep<Request>()
  const sessionManager = container.resolve("sessionManager")
  const session = await sessionManager.get(initialRequest)
  session.set("user", SessionUtilisateur.creerSessionUtilisateur({ id, name: { familyName: nom, givenName: prenom }}))

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
