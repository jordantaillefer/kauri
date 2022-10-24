import { ServerRequest } from "../../../app/ServerRequest"
import { created, ServerResponse, success } from "../../../app/ServerResponse"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { Programme } from "../../domain/Programme"
import { CreerProgrammeUseCase } from "../../usecases/CreerProgrammeUseCase"
import { ListerProgrammesUseCase } from "../../usecases/ListerProgrammesUseCase"
import { ProgrammeContrat } from "../../../app/contrats"

interface Dependencies {
  creerProgrammeUseCase: CreerProgrammeUseCase
  listerProgrammeUseCase: ListerProgrammesUseCase
}

@Controller()
export class ProgrammeController {
  private creerProgrammeUseCase: CreerProgrammeUseCase
  private listerProgrammeUseCase: ListerProgrammesUseCase

  constructor({ creerProgrammeUseCase, listerProgrammeUseCase }: Dependencies) {
    this.creerProgrammeUseCase = creerProgrammeUseCase
    this.listerProgrammeUseCase = listerProgrammeUseCase
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
    return success(listeDeProgrammes.map(presenterProgrammeEnProgrammeContrat))
  }
}

function presenterProgrammeEnProgrammeContrat(programme: Programme): ProgrammeContrat {
  return {
    id:  programme.id,
    idUtilisateur:  programme.idUtilisateur,
    nomProgramme:  programme.nomProgramme
  }
}