import { CompteUtilisateur } from "../CompteUtilisateur"

export interface AuthentificationService {
  seConnecter: (request: Request) => Promise<CompteUtilisateur>

  seDeconnecter(request: Request): Promise<string>

  recupererCompteUtilisateurConnecte(request: Request): Promise<CompteUtilisateur>
}