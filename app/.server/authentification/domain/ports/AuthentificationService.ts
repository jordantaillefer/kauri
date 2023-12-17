import type { CompteUtilisateur } from "../CompteUtilisateur"

export interface AuthentificationService {
  seConnecter: (request: Request) => Promise<void>

  seDeconnecter(request: Request): Promise<string>

  recupererCompteUtilisateurConnecte(request: Request): Promise<CompteUtilisateur>
}