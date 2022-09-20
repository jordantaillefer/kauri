import {
  CompteUtilisateurRepository
} from "../infrastructure/adapters/compte_utilisateur_repository/CompteUtilisateurRepository"
import { CompteUtilisateur } from "../infrastructure/domain/CompteUtilisateur"

export class CreerCompteUtilisateurUseCase {
  private compteUtilisateurRepository: CompteUtilisateurRepository

  constructor(compteUtilisateurRepository: CompteUtilisateurRepository) {
    this.compteUtilisateurRepository = compteUtilisateurRepository
  }


  async execute(userId: string): Promise<CompteUtilisateur> {
    return this.compteUtilisateurRepository.creerCompteUtilisateur(userId)
  }
}