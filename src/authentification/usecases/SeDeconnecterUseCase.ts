import { AuthentificationService } from "../domains/ports/AuthentificationService"

export class SeDeconnecterUseCase {
  private authentificationService: AuthentificationService

  constructor({ authentificationService }: { authentificationService: AuthentificationService }) {
    this.authentificationService = authentificationService
  }

  async execute(request: Request): Promise<string> {
    return this.authentificationService.seDeconnecter(request)
  }
}