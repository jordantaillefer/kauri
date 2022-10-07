import {
  CompteUtilisateurRepository
} from "../infrastructure/adapters/compte_utilisateur_repository/CompteUtilisateurRepository"
import { CompteUtilisateur } from "../infrastructure/domain/CompteUtilisateur"
import { ContainerDependencies } from "api"

export class CreerCompteUtilisateurUseCase {
  private compteUtilisateurRepository: CompteUtilisateurRepository

  constructor(dependencies: ContainerDependencies) {
    this.compteUtilisateurRepository = dependencies.compteUtilisateurRepository
  }

  async execute(userId: string): Promise<CompteUtilisateur> {
    return this.compteUtilisateurRepository.creerCompteUtilisateur(CompteUtilisateur.creerCompteUtilisateur(userId))
  }
}