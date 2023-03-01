import invariant from "tiny-invariant"

import { ServerRequestWithoutPayload } from "../../../app/ServerRequest"
import { created, ServerResponse, success } from "../../../app/ServerResponse"
import { SeanceContrat } from "../../../app/contrats/SeanceContrat"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { Seance } from "../../domain/Seance"
import { InitialiserSeanceUseCase } from "../../usecases/InitialiserSeanceUseCase"
import { ListerSeanceUseCase } from "../../usecases/ListerSeanceUseCase"

interface Dependencies {
  initialiserSeanceUseCase: InitialiserSeanceUseCase
  listerSeanceUseCase: ListerSeanceUseCase
}

@Controller()
export class SeanceController {
  private initialiserSeanceUseCase: InitialiserSeanceUseCase
  private listerSeanceUseCase: ListerSeanceUseCase

  constructor({ initialiserSeanceUseCase, listerSeanceUseCase }: Dependencies) {
    this.initialiserSeanceUseCase = initialiserSeanceUseCase
    this.listerSeanceUseCase = listerSeanceUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async initialiserSeance(serverRequest: ServerRequestWithoutPayload): Promise<ServerResponse<SeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const nouvelleSeance = await this.initialiserSeanceUseCase.execute(serverRequest.compteUtilisateurConnecte.id)
    return created(presenterEnSeanceContrat(nouvelleSeance))
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async listerSeance(serverRequest: ServerRequestWithoutPayload): Promise<ServerResponse<SeanceContrat[]>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const listeSeance = await this.listerSeanceUseCase.execute(serverRequest.compteUtilisateurConnecte.id)
    return success(listeSeance.map(presenterEnSeanceContrat))
  }
}

function presenterEnSeanceContrat(seance: Seance): SeanceContrat {
  return {
    id: seance.id,
    nomSeance: seance.nomSeance
  }
}