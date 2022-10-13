import {
  CompteUtilisateurRepository
} from "../infrastructure/adapters/compte_utilisateur_repository/CompteUtilisateurRepository"
import { CompteUtilisateur } from "../domain/CompteUtilisateur"
import { ContainerDependencies } from "api"

export class RecupererCompteUtilisateurUseCase {
  private compteUtilisateurRepository: CompteUtilisateurRepository

  constructor(depedencies: ContainerDependencies) {
    this.compteUtilisateurRepository = depedencies.compteUtilisateurRepository
  }

  async execute(userId: string): Promise<CompteUtilisateur | null> {
    return this.compteUtilisateurRepository.recupererCompteUtilisateur(userId)
  }
}