import invariant from "tiny-invariant"

import { ServerRequestWithoutPayload } from "../../../app/ServerRequest"
import { created, ServerResponse } from "../../../app/ServerResponse"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { InitialiserSeanceUseCase } from "../../usecases/InitialiserSeanceUseCase"

interface Dependencies {
  initialiserSeanceUseCase: InitialiserSeanceUseCase
}

@Controller()
export class SeanceController {
  private initialiserSeanceUseCase: InitialiserSeanceUseCase

  constructor({ initialiserSeanceUseCase }: Dependencies) {
    this.initialiserSeanceUseCase = initialiserSeanceUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async initialiserSeance(serverRequest: ServerRequestWithoutPayload): Promise<ServerResponse<void>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const nouveauProgramme = await this.initialiserSeanceUseCase.execute(serverRequest.compteUtilisateurConnecte.id)
    return created(nouveauProgramme)
  }
}