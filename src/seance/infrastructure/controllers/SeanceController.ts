import invariant from "tiny-invariant"

import { ServerRequest, ServerRequestWithoutPayload } from "../../../app/ServerRequest"
import { created, ServerResponse, success } from "../../../app/ServerResponse"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { ExerciceSeance } from "../../domain/ExerciceSeance"
import { Seance } from "../../domain/Seance"
import { InitialiserSeanceUseCase } from "../../usecases/InitialiserSeanceUseCase"
import { ListerSeanceUseCase } from "../../usecases/ListerSeanceUseCase"
import { RecupererSeanceUseCase } from "../../usecases/RecupererSeanceUseCase"
import { ExerciceSeanceContrat, SeanceContrat } from "api"

interface Dependencies {
  initialiserSeanceUseCase: InitialiserSeanceUseCase
  listerSeanceUseCase: ListerSeanceUseCase
  recupererSeanceUseCase: RecupererSeanceUseCase
}

@Controller()
export class SeanceController {
  private initialiserSeanceUseCase: InitialiserSeanceUseCase
  private listerSeanceUseCase: ListerSeanceUseCase
  private recupererSeanceUseCase: RecupererSeanceUseCase

  constructor({ initialiserSeanceUseCase, listerSeanceUseCase, recupererSeanceUseCase }: Dependencies) {
    this.initialiserSeanceUseCase = initialiserSeanceUseCase
    this.listerSeanceUseCase = listerSeanceUseCase
    this.recupererSeanceUseCase = recupererSeanceUseCase
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

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async recupererSeanceParId(serverRequest: ServerRequest<{ idSeance: string }>): Promise<ServerResponse<SeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance } = serverRequest.payload
    const seanceResult = await this.recupererSeanceUseCase.execute(serverRequest.compteUtilisateurConnecte.id, idSeance)
    return success(presenterEnSeanceContrat(seanceResult))
  }
}

function presenterEnExerciceSeanceContrat(exerciceSeance: ExerciceSeance): ExerciceSeanceContrat {
  return {
    id: exerciceSeance.id,
    nomExercice: exerciceSeance.nomExercice,
    categorie: exerciceSeance.categorie,
    idExercice: exerciceSeance.idExercice
  }
}

function presenterEnSeanceContrat(seance: Seance): SeanceContrat {
  return {
    id: seance.id,
    nomSeance: seance.nomSeance,
    exerciceSeances: seance.exerciceSeances.map(presenterEnExerciceSeanceContrat)
  }
}