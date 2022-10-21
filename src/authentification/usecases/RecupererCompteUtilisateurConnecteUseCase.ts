import { CompteUtilisateur } from "../domain/CompteUtilisateur"
import { AuthentificationService } from "../domains/ports/AuthentificationService"

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