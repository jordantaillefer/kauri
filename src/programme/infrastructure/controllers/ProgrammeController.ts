import { ServerRequest } from "../../../app/ServerRequest"
import { created, ServerResponse } from "../../../app/ServerResponse"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { Programme } from "../../domain/Programme"
import { CreerProgrammeUseCase } from "../../usecases/CreerProgrammeUseCase"

interface Dependencies {
  creerProgrammeUseCase: CreerProgrammeUseCase
}

@Controller()
export class ProgrammeController {
  private creerProgrammeUseCase: CreerProgrammeUseCase

  constructor({ creerProgrammeUseCase }: Dependencies) {
    this.creerProgrammeUseCase = creerProgrammeUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async creerProgramme(serverRequest: ServerRequest<{ nomProgramme: string }>): Promise<ServerResponse<Programme>> {
    const nouveauProgramme = await this.creerProgrammeUseCase.execute(serverRequest.compteUtilisateurConnecte?.getId() as string, serverRequest.payload.nomProgramme)
    return created(nouveauProgramme)
  }
}