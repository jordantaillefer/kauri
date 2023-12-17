import type { CompteUtilisateur } from "../domain/CompteUtilisateur"
import type { CompteUtilisateurRepository } from "../domain/ports/CompteUtilisateurRepository"

interface Dependencies {
  compteUtilisateurRepository: CompteUtilisateurRepository
}

export class RecupererCompteUtilisateurUseCase {
  private compteUtilisateurRepository: CompteUtilisateurRepository

  constructor({ compteUtilisateurRepository }: Dependencies) {
    this.compteUtilisateurRepository = compteUtilisateurRepository
  }

  async execute(idUtilisateur: string): Promise<CompteUtilisateur> {
    return this.compteUtilisateurRepository.recupererCompteUtilisateurParId(idUtilisateur)
  }
}