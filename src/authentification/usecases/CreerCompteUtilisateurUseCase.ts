import { CompteUtilisateur } from "../domain/CompteUtilisateur"
import { CompteUtilisateurRepository } from "../domain/ports/CompteUtilisateurRepository"

export interface Dependencies {
  compteUtilisateurRepository: CompteUtilisateurRepository
}

export class CreerCompteUtilisateurUseCase {
  private compteUtilisateurRepository: CompteUtilisateurRepository

  constructor({ compteUtilisateurRepository }: Dependencies) {
    this.compteUtilisateurRepository = compteUtilisateurRepository
  }

  async execute(idUtilisateur: string): Promise<CompteUtilisateur> {
    return this.compteUtilisateurRepository.creerCompteUtilisateur(CompteUtilisateur.creerCompteUtilisateur({ id: idUtilisateur }))
  }
}