import type { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import type { CreerCompteUtilisateurUseCase } from "../../usecases/CreerCompteUtilisateurUseCase"
import type { RecupererCompteUtilisateurConnecteUseCase } from "../../usecases/RecupererCompteUtilisateurConnecteUseCase"
import type { RecupererCompteUtilisateurUseCase } from "../../usecases/RecupererCompteUtilisateurUseCase"
import type { SeConnecterUseCase } from "../../usecases/SeConnecterUseCase"
import type { SeDeconnecterUseCase } from "../../usecases/SeDeconnecterUseCase"
import type { ServerRequest } from "~/server/app/ServerRequest"
import type { ServerResponse} from "~/server/app/ServerResponse";
import { created, success } from "~/server/app/ServerResponse"
import { Controller } from "~/server/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "~/server/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "~/server/app/decorators/ProduceServerResponseDecorator"
import type { SessionManager } from "~/server/app/session.server"

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
    const user = session.get('user') as { id: string, name: { familyName: string, givenName: string }}
    await this.creerCompteUtilisateurUseCase.execute({ idUtilisateur: user.id, nom: user.name.familyName, prenom: user.name.givenName })
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
