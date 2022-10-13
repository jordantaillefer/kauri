import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import { CreerCompteUtilisateurUseCase } from "../../usecases/CreerCompteUtilisateurUseCase"
import { RecupererCompteUtilisateurUseCase } from "../../usecases/RecupererCompteUtilisateurUseCase"
import { ContainerDependencies } from "api"

export class CompteUtilisateurController {
  private creerCompteUtilisateurUseCase: CreerCompteUtilisateurUseCase
  private recupererCompteUtilisateurUseCase: RecupererCompteUtilisateurUseCase

  constructor(dependencies: ContainerDependencies) {
    this.creerCompteUtilisateurUseCase = dependencies.creerCompteUtilisateurUseCase
    this.recupererCompteUtilisateurUseCase = dependencies.recupererCompteUtilisateurUseCase
  }

  async recupererCompteUtilisateur(id: string): Promise<CompteUtilisateur | null> {
    return this.recupererCompteUtilisateurUseCase.execute(id)
  }

  async creerCompteUtilisateur(id: string): Promise<void> {
    await this.creerCompteUtilisateurUseCase.execute(id)
  }
}