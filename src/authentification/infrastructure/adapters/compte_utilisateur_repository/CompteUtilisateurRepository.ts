import { CompteUtilisateur } from "../../domain/CompteUtilisateur"

export interface CompteUtilisateurRepository {
  creerCompteUtilisateur(compteUtilisateur: CompteUtilisateur): Promise<CompteUtilisateur>

  recupererCompteUtilisateur(compteUtilisateurId: string): Promise<CompteUtilisateur | null>
}