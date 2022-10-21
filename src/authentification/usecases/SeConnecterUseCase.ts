import { CompteUtilisateur } from "../domain/CompteUtilisateur"
import { AuthentificationService } from "../domains/ports/AuthentificationService"

export class SeConnecterUseCase {
  private authentificationService: AuthentificationService

  constructor({ authentificationService }: { authentificationService: AuthentificationService }) {
    this.authentificationService = authentificationService
  }

  async execute(request: Request): Promise<CompteUtilisateur> {
    return this.authentificationService.seConnecter(request)
  }
}