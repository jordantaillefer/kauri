import { CompteUtilisateur } from "../domain/CompteUtilisateur"
import type { CompteUtilisateurRepository } from "../domain/ports/CompteUtilisateurRepository"

interface Dependencies {
  compteUtilisateurRepository: CompteUtilisateurRepository
}

export class CreerCompteUtilisateurUseCase {
  private compteUtilisateurRepository: CompteUtilisateurRepository

  constructor({ compteUtilisateurRepository }: Dependencies) {
    this.compteUtilisateurRepository = compteUtilisateurRepository
  }

  async execute({ idUtilisateur, nom, prenom }: { idUtilisateur: string, nom: string, prenom: string }): Promise<CompteUtilisateur> {
    return this.compteUtilisateurRepository.creerCompteUtilisateur(
      CompteUtilisateur.creerCompteUtilisateur({ id: idUtilisateur, nom, prenom })
    )
  }
}
