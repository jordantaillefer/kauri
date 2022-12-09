import { ServerRequest } from "../../../app/ServerRequest"
import { created, ServerResponse, success } from "../../../app/ServerResponse"
import { ProgrammeContrat } from "../../../app/contrats"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { Programme } from "../../domain/Programme"
import { CreerProgrammeUseCase } from "../../usecases/CreerProgrammeUseCase"
import { ListerProgrammesUseCase } from "../../usecases/ListerProgrammesUseCase"
import { RecupererDetailProgrammeUseCase } from "../../usecases/RecupererDetailProgrammeUseCase"

interface Dependencies {
  creerProgrammeUseCase: CreerProgrammeUseCase
  listerProgrammeUseCase: ListerProgrammesUseCase
  recupererDetailProgrammeUseCase: RecupererDetailProgrammeUseCase
}

@Controller()
export class ProgrammeController {
  private creerProgrammeUseCase: CreerProgrammeUseCase
  private listerProgrammeUseCase: ListerProgrammesUseCase
  private recupererDetailProgrammeUseCase: RecupererDetailProgrammeUseCase

  constructor({ creerProgrammeUseCase, listerProgrammeUseCase, recupererDetailProgrammeUseCase }: Dependencies) {
    this.creerProgrammeUseCase = creerProgrammeUseCase
    this.listerProgrammeUseCase = listerProgrammeUseCase
    this.recupererDetailProgrammeUseCase = recupererDetailProgrammeUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async creerProgramme(serverRequest: ServerRequest<{ nomProgramme: string }>): Promise<ServerResponse<Programme>> {
    const nouveauProgramme = await this.creerProgrammeUseCase.execute(serverRequest.compteUtilisateurConnecte?.id as string, serverRequest.payload.nomProgramme)
    return created(nouveauProgramme)
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async listerProgramme(serverRequest: ServerRequest<{}>) {
    const listeDeProgrammes = await this.listerProgrammeUseCase.execute(serverRequest.compteUtilisateurConnecte?.id as string)
    return success(listeDeProgrammes.map(presenterEnProgrammeContrat))
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async recupererDetail(serverRequest: ServerRequest<{ idProgramme: string }>) {
    const programme = await this.recupererDetailProgrammeUseCase.execute(serverRequest.compteUtilisateurConnecte?.id as string, serverRequest.payload.idProgramme)
    return success((presenterEnProgrammeContrat(programme)))
  }
}

function presenterEnProgrammeContrat(programme: Programme): ProgrammeContrat {
  return {
    id: programme.id,
    nomProgramme: programme.nomProgramme,
  }
}