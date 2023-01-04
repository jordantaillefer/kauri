import { format } from "../../../app/DateFormatter"
import { ServerRequest } from "../../../app/ServerRequest"
import { created, deleted, ServerResponse, success } from "../../../app/ServerResponse"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { SeanceEntrainement } from "../../domain/SeanceEntrainement"
import { AjouterSeanceAUnProgrammeUseCase } from "../../usecases/AjouterSeanceAUnProgrammeUseCase"
import {
  ListerSeanceEntrainementPourUnProgrammeUseCase
} from "../../usecases/ListerSeanceEntrainementPourUnProgrammeUseCase"
import { SupprimerSeanceEntrainementUseCase } from "../../usecases/SupprimerSeanceEntrainementUseCase"
import { SeanceEntrainementContrat } from "api"

interface Dependencies {
  ajouterSeanceAUnProgrammeUseCase: AjouterSeanceAUnProgrammeUseCase
  listerSeanceEntrainementPourUnProgrammeUseCase: ListerSeanceEntrainementPourUnProgrammeUseCase
  supprimerSeanceEntrainementUseCase: SupprimerSeanceEntrainementUseCase
}

@Controller()
export class SeanceEntrainementController {
  private ajouterSeanceAUnProgrammeUseCase: AjouterSeanceAUnProgrammeUseCase
  private listerSeanceEntrainementPourUnProgrammeUseCase: ListerSeanceEntrainementPourUnProgrammeUseCase
  private supprimerSeanceEntrainementUseCase: SupprimerSeanceEntrainementUseCase

  constructor({
                ajouterSeanceAUnProgrammeUseCase,
                listerSeanceEntrainementPourUnProgrammeUseCase,
                supprimerSeanceEntrainementUseCase
              }: Dependencies) {
    this.ajouterSeanceAUnProgrammeUseCase = ajouterSeanceAUnProgrammeUseCase
    this.listerSeanceEntrainementPourUnProgrammeUseCase = listerSeanceEntrainementPourUnProgrammeUseCase
    this.supprimerSeanceEntrainementUseCase = supprimerSeanceEntrainementUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async creerSeanceEntrainement(serverRequest: ServerRequest<{ idProgramme: string }>): Promise<ServerResponse<void>> {
    await this.ajouterSeanceAUnProgrammeUseCase.execute(serverRequest.compteUtilisateurConnecte?.id as string, serverRequest.payload.idProgramme)
    return created()
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async supprimerSeanceEntrainement(serverRequest: ServerRequest<{ idSeanceEntrainement: string }>): Promise<ServerResponse<void>> {
    await this.supprimerSeanceEntrainementUseCase.execute(serverRequest.payload.idSeanceEntrainement)
    return deleted()
  }

  async listerSeanceEntrainement(serverRequest: ServerRequest<{ idProgramme: string }>): Promise<ServerResponse<SeanceEntrainementContrat[]>> {
    const listeSeanceEntrainement = await this.listerSeanceEntrainementPourUnProgrammeUseCase.execute(serverRequest.payload.idProgramme)
    return success(listeSeanceEntrainement.map(presenterEnSeanceEntrainementContrat))
  }
}

function presenterEnSeanceEntrainementContrat(seanceEntrainement: SeanceEntrainement): SeanceEntrainementContrat {
  return {
    id: seanceEntrainement.id,
  }
}