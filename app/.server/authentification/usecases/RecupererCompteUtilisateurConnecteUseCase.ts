import type { CompteUtilisateur } from "../domain/CompteUtilisateur"
import type { AuthentificationService } from "../domain/ports/AuthentificationService"

interface Dependencies {
  authentificationService: AuthentificationService
}

export class RecupererCompteUtilisateurConnecteUseCase {
  private authentificationService: AuthentificationService

  constructor({ authentificationService }: Dependencies) {
    this.authentificationService = authentificationService
  }

  async execute(request: Request): Promise<CompteUtilisateur> {
    return this.authentificationService.recupererCompteUtilisateurConnecte(request)
  }
}