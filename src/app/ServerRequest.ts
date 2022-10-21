import { CompteUtilisateur } from "../authentification/domain/CompteUtilisateur"

export interface ServerRequest<T> {
  payload: T,
  request: Request
  compteUtilisateurConnecte?: CompteUtilisateur
}