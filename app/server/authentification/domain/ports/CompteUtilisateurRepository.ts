import type { CompteUtilisateur } from "../CompteUtilisateur"

export interface CompteUtilisateurRepository {
  creerCompteUtilisateur(compteUtilisateur: CompteUtilisateur): Promise<CompteUtilisateur>

  recupererCompteUtilisateurParId(compteUtilisateurId: string): Promise<CompteUtilisateur>
}