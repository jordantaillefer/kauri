import { ReasonPhrases } from "http-status-codes"

import { Controller } from "../../../app/ControllerDecorator"
import { ProduceApiResponse } from "../../../app/ProduceApiResponseDecorator"
import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import { CreerCompteUtilisateurUseCase } from "../../usecases/CreerCompteUtilisateurUseCase"
import { RecupererCompteUtilisateurUseCase } from "../../usecases/RecupererCompteUtilisateurUseCase"

interface Dependencies {
  creerCompteUtilisateurUseCase: CreerCompteUtilisateurUseCase
  recupererCompteUtilisateurUseCase: RecupererCompteUtilisateurUseCase
}

type ApiResponse<T> = {
  reasonPhrase: ReasonPhrases
  data: T | string
}

const success = <T>(data: T): ApiResponse<T> => ({ reasonPhrase: ReasonPhrases.OK, data })

@Controller()
export class CompteUtilisateurController {
  private creerCompteUtilisateurUseCase: CreerCompteUtilisateurUseCase
  private recupererCompteUtilisateurUseCase: RecupererCompteUtilisateurUseCase

  constructor({ creerCompteUtilisateurUseCase, recupererCompteUtilisateurUseCase }: Dependencies) {
    this.creerCompteUtilisateurUseCase = creerCompteUtilisateurUseCase
    this.recupererCompteUtilisateurUseCase = recupererCompteUtilisateurUseCase
  }

  @ProduceApiResponse()
  async recupererCompteUtilisateur(id: string): Promise<ApiResponse<CompteUtilisateur>> {
    const compteUtilisateur = await this.recupererCompteUtilisateurUseCase.execute(id)
    return success(compteUtilisateur)
  }

  @ProduceApiResponse()
  async creerCompteUtilisateur(id: string): Promise<void> {
    await this.creerCompteUtilisateurUseCase.execute(id)
  }

  private testPrivate() {

  }
  testPasPrivate() {

  }
}
