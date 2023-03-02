import invariant from "tiny-invariant"

import { ServerRequest } from "../../../app/ServerRequest"
import { created, ServerResponse } from "../../../app/ServerResponse"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { InitialiserExerciceSeanceUseCase } from "../../usecases/InitialiserExerciceSeanceUseCase"

interface Dependencies {
  initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
}

@Controller()
export class ExerciceSeanceController {
  private initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase

  constructor({ initialiserExerciceSeanceUseCase }: Dependencies) {
    this.initialiserExerciceSeanceUseCase = initialiserExerciceSeanceUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async initialiserExerciceSeance(serverRequest: ServerRequest<{ idSeance: string, idExercice: string }>): Promise<ServerResponse<void>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance, idExercice } = serverRequest.payload
    await this.initialiserExerciceSeanceUseCase.execute(idSeance, idExercice)
    return created()
  }
}
