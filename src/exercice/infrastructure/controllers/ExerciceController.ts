import { ServerRequestWithoutPayload } from "../../../app/ServerRequest"
import { ServerResponse, success } from "../../../app/ServerResponse"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { Exercice } from "../../domain/Exercice"
import { ListerExerciceUseCase } from "../../usecases/ListerExerciceUseCase"
import { ExerciceContrat, ListeExerciceContrat } from "api"

interface Dependencies {
  listerExerciceUseCase: ListerExerciceUseCase
}

@Controller()
export class ExerciceController {
  private listerExerciceUseCase: ListerExerciceUseCase

  constructor({ listerExerciceUseCase }: Dependencies) {
    this.listerExerciceUseCase = listerExerciceUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async listerExercice(serverRequest: ServerRequestWithoutPayload): Promise<ServerResponse<ListeExerciceContrat>> {
    const listeExercice = await this.listerExerciceUseCase.execute()
    return success(presenterEnListeExerciceContrat(listeExercice))
  }
}

function presenterEnListeExerciceContrat(listeExercice: Exercice[]): ListeExerciceContrat {
  return listeExercice.reduce((acc, value) => {
    acc.set(value.categorie,
      [...(acc.get(value.categorie) || []),
        {
          id: value.id,
          nomExercice: value.nomExercice,
          categorie: value.categorie
        }
      ]
    )
    return acc
  }, new Map<string, ExerciceContrat[]>())
}