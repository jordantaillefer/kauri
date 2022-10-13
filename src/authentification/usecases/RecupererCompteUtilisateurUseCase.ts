import { CompteUtilisateur } from "../domain/CompteUtilisateur"
import { CompteUtilisateurRepository } from "../domain/ports/CompteUtilisateurRepository"

interface Dependencies {
  compteUtilisateurRepository: CompteUtilisateurRepository
}

export class RecupererCompteUtilisateurUseCase implements Dependencies {
  compteUtilisateurRepository: CompteUtilisateurRepository

  constructor({ compteUtilisateurRepository }: Dependencies) {
    this.compteUtilisateurRepository = compteUtilisateurRepository
  }

  async execute(userId: string): Promise<CompteUtilisateur> {
    return this.compteUtilisateurRepository.recupererCompteUtilisateurParId(userId)
  }
}