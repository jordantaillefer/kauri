import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import { CreerCompteUtilisateurUseCase } from "../../usecases/CreerCompteUtilisateurUseCase"
import { RecupererCompteUtilisateurConnecteUseCase } from "../../usecases/RecupererCompteUtilisateurConnecteUseCase"
import { RecupererCompteUtilisateurUseCase } from "../../usecases/RecupererCompteUtilisateurUseCase"
import { SeConnecterUseCase } from "../../usecases/SeConnecterUseCase"
import { SeDeconnecterUseCase } from "../../usecases/SeDeconnecterUseCase"
import type { ServerRequest } from "api/app/ServerRequest"
import { created, ServerResponse, success } from "api/app/ServerResponse"
import { Controller } from "api/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "api/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "api/app/decorators/ProduceServerResponseDecorator"
import { SessionManager } from "api/app/session.server"

interface Dependencies {
  creerCompteUtilisateurUseCase: CreerCompteUtilisateurUseCase
  recupererCompteUtilisateurUseCase: RecupererCompteUtilisateurUseCase
  recupererCompteUtilisateurConnecteUseCase: RecupererCompteUtilisateurConnecteUseCase
  seConnecterUseCase: SeConnecterUseCase
  seDeconnecterUseCase: SeDeconnecterUseCase
  sessionManager: SessionManager
}

@Controller()
export class CompteUtilisateurController {
  private creerCompteUtilisateurUseCase: CreerCompteUtilisateurUseCase
  private recupererCompteUtilisateurUseCase: RecupererCompteUtilisateurUseCase
  private seConnecterUseCase: SeConnecterUseCase
  private seDeconnecterUseCase: SeDeconnecterUseCase
  private recupererCompteUtilisateurConnecteUseCase: RecupererCompteUtilisateurConnecteUseCase
  private sessionManager: SessionManager

  constructor({
    creerCompteUtilisateurUseCase,
    recupererCompteUtilisateurUseCase,
    recupererCompteUtilisateurConnecteUseCase,
    seConnecterUseCase,
    seDeconnecterUseCase,
    sessionManager
  }: Dependencies) {
    this.creerCompteUtilisateurUseCase = creerCompteUtilisateurUseCase
    this.recupererCompteUtilisateurUseCase = recupererCompteUtilisateurUseCase
    this.recupererCompteUtilisateurConnecteUseCase = recupererCompteUtilisateurConnecteUseCase
    this.seConnecterUseCase = seConnecterUseCase
    this.seDeconnecterUseCase = seDeconnecterUseCase
    this.sessionManager = sessionManager
  }

  @ProduceServerResponse()
  async recupererCompteUtilisateur(id: string): Promise<ServerResponse<CompteUtilisateur>> {
    const compteUtilisateur = await this.recupererCompteUtilisateurUseCase.execute(id)
    return success(compteUtilisateur)
  }

  @ProduceServerResponse()
  async creerCompteUtilisateur(request: Request): Promise<ServerResponse<void>> {
    const session = await this.sessionManager.get(request)
    await this.creerCompteUtilisateurUseCase.execute(session.get("user").id)
    return created()
  }

  async authenticate(request: Request) {
    return this.seConnecterUseCase.execute(request)
  }

  @ProduceServerResponse()
  async recupererCompteUtilisateurConnecte(request: Request): Promise<ServerResponse<CompteUtilisateur>> {
    const compteUtilisateur = await this.recupererCompteUtilisateurConnecteUseCase.execute(request)
    return success(compteUtilisateur)
  }

  @DoitEtreAuthentifie()
  async seDeconnecter(request: ServerRequest<null>): Promise<string> {
    return this.seDeconnecterUseCase.execute(request.request)
  }
}
