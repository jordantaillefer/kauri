import type { CompteUtilisateur } from "../domain/CompteUtilisateur"
import type { AuthentificationService } from "../domain/ports/AuthentificationService"

export class SeConnecterUseCase {
  private authentificationService: AuthentificationService

  constructor({ authentificationService }: { authentificationService: AuthentificationService }) {
    this.authentificationService = authentificationService
  }

  async execute(request: Request): Promise<void> {
    return this.authentificationService.seConnecter(request)
  }
}