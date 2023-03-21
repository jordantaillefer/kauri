import invariant from "tiny-invariant"

import { ServerRequest } from "../../../app/ServerRequest"
import { created, ServerResponse, success } from "../../../app/ServerResponse"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { ExerciceSeance } from "../../domain/ExerciceSeance"
import { SerieExerciceSeance } from "../../domain/SerieExerciceSeance"
import {
  DefinirSerieExerciceSeanceUseCase,
  SerieExerciceSeancePayload
} from "../../usecases/DefinirSerieExerciceSeanceUseCase"
import { InitialiserExerciceSeanceUseCase } from "../../usecases/InitialiserExerciceSeanceUseCase"
import { RecupererExerciceSeanceUseCase } from "../../usecases/RecupererExerciceSeanceUseCase"
import { ExerciceSeanceContrat, SerieExerciceSeanceContrat } from "api"

interface Dependencies {
  initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
  recupererExerciceSeanceUseCase: RecupererExerciceSeanceUseCase
  definirSerieExerciceSeanceUseCase: DefinirSerieExerciceSeanceUseCase
}

@Controller()
export class ExerciceSeanceController {
  private initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
  private recupererExerciceSeanceUseCase: RecupererExerciceSeanceUseCase
  private definirSerieExerciceSeanceUseCase: DefinirSerieExerciceSeanceUseCase

  constructor({
                initialiserExerciceSeanceUseCase,
                recupererExerciceSeanceUseCase,
                definirSerieExerciceSeanceUseCase
              }: Dependencies) {
    this.initialiserExerciceSeanceUseCase = initialiserExerciceSeanceUseCase
    this.recupererExerciceSeanceUseCase = recupererExerciceSeanceUseCase
    this.definirSerieExerciceSeanceUseCase = definirSerieExerciceSeanceUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async initialiserExerciceSeance(serverRequest: ServerRequest<{ idSeance: string, idExercice: string }>): Promise<ServerResponse<ExerciceSeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance, idExercice } = serverRequest.payload
    const exerciceSeance = await this.initialiserExerciceSeanceUseCase.execute(idSeance, idExercice)
    return created(presenterEnExerciceSeanceContrat(exerciceSeance))
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async recupererExerciceSeance(serverRequest: ServerRequest<{ idSeance: string, idExerciceSeance: string }>): Promise<ServerResponse<ExerciceSeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance, idExerciceSeance } = serverRequest.payload
    const exerciceSeance = await this.recupererExerciceSeanceUseCase.execute(idSeance, idExerciceSeance)
    return success(presenterEnExerciceSeanceContrat(exerciceSeance))
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async definirSerieExerciceSeance(serverRequest: ServerRequest<{ idSeance: string, idExerciceSeance: string, listeSerieExerciceSeance: SerieExerciceSeancePayload[] }>): Promise<ServerResponse<void>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance, idExerciceSeance, listeSerieExerciceSeance } = serverRequest.payload
    await this.definirSerieExerciceSeanceUseCase.execute(idSeance, idExerciceSeance, listeSerieExerciceSeance)
    return success()
  }
}

function presenterEnSerieExerciceSeanceContrat(serieExerciceSeance: SerieExerciceSeance): SerieExerciceSeanceContrat {
  return {
    repetitions: serieExerciceSeance.repetitions
  }
}

function presenterEnExerciceSeanceContrat(exerciceSeance: ExerciceSeance): ExerciceSeanceContrat {
  return {
    id: exerciceSeance.id,
    nomExercice: exerciceSeance.nomExercice,
    categorie: exerciceSeance.categorie,
    idExercice: exerciceSeance.idExercice,
    ordre: exerciceSeance.ordre,
    listeSerieExerciceSeance: exerciceSeance.listeSerieExerciceSeance.map(presenterEnSerieExerciceSeanceContrat)
  }
}
