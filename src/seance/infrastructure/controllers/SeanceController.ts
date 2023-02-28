import invariant from "tiny-invariant"

import { ServerRequestWithoutPayload } from "../../../app/ServerRequest"
import { created, ServerResponse } from "../../../app/ServerResponse"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { Seance } from "../../domain/Seance"
import { InitialiserSeanceUseCase } from "../../usecases/InitialiserSeanceUseCase"
import { ProgrammeContrat } from "api"
import { SeanceContrat } from "../../../app/contrats/SeanceContrat"

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
  async initialiserSeance(serverRequest: ServerRequestWithoutPayload): Promise<ServerResponse<SeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const nouvelleSeance = await this.initialiserSeanceUseCase.execute(serverRequest.compteUtilisateurConnecte.id)
    return created(presenterEnSeanceContrat(nouvelleSeance))
  }
}

function presenterEnSeanceContrat(seance: Seance): SeanceContrat {
  return {
    id: seance.id,
    nomSeance: seance.nomSeance
  }
}