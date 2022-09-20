import { CompteUtilisateur } from "../../domain/CompteUtilisateur"

export interface CompteUtilisateurRepository {
  creerCompteUtilisateur(id: string): Promise<CompteUtilisateur>

  recupererCompteUtilisateur(compteUtilisateurId: string): Promise<CompteUtilisateur>
}