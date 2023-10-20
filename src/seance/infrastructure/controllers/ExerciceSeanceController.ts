import invariant from "tiny-invariant"

import { ExerciceSeance } from "../../domain/ExerciceSeance"
import { SerieExerciceSeance } from "../../domain/SerieExerciceSeance"
import {
  DefinirSerieExerciceSeanceUseCase,
  SerieExerciceSeancePayload
} from "../../usecases/DefinirSerieExerciceSeanceUseCase"
import { DefinirTempsReposExerciceSeanceUseCase } from "../../usecases/DefinirTempsReposExerciceSeanceUseCase"
import { InitialiserExerciceSeanceUseCase } from "../../usecases/InitialiserExerciceSeanceUseCase"
import { RecupererExerciceSeanceUseCase } from "../../usecases/RecupererExerciceSeanceUseCase"
import { ExerciceSeanceContrat, SerieExerciceSeanceContrat } from "api"
import type { ServerRequest } from "api/app/ServerRequest"
import { created, ServerResponse, success, updated } from "api/app/ServerResponse"
import { Controller } from "api/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "api/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "api/app/decorators/ProduceServerResponseDecorator"

interface Dependencies {
  initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
  recupererExerciceSeanceUseCase: RecupererExerciceSeanceUseCase
  definirSerieExerciceSeanceUseCase: DefinirSerieExerciceSeanceUseCase
  definirTempsReposExerciceSeanceUseCase: DefinirTempsReposExerciceSeanceUseCase
}

@Controller()
export class ExerciceSeanceController {
  private initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
  private recupererExerciceSeanceUseCase: RecupererExerciceSeanceUseCase
  private definirSerieExerciceSeanceUseCase: DefinirSerieExerciceSeanceUseCase
  private definirTempsReposExerciceSeanceUseCase: DefinirTempsReposExerciceSeanceUseCase

  constructor({
    initialiserExerciceSeanceUseCase,
    recupererExerciceSeanceUseCase,
    definirSerieExerciceSeanceUseCase,
    definirTempsReposExerciceSeanceUseCase
  }: Dependencies) {
    this.initialiserExerciceSeanceUseCase = initialiserExerciceSeanceUseCase
    this.recupererExerciceSeanceUseCase = recupererExerciceSeanceUseCase
    this.definirSerieExerciceSeanceUseCase = definirSerieExerciceSeanceUseCase
    this.definirTempsReposExerciceSeanceUseCase = definirTempsReposExerciceSeanceUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async initialiserExerciceSeance(
    serverRequest: ServerRequest<{
      idSeance: string
      idExercice: string
    }>
  ): Promise<ServerResponse<ExerciceSeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance, idExercice } = serverRequest.payload
    const exerciceSeance = await this.initialiserExerciceSeanceUseCase.execute(idSeance, idExercice)
    return created(presenterEnExerciceSeanceContrat(exerciceSeance))
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async recupererExerciceSeance(
    serverRequest: ServerRequest<{
      idSeance: string
      idExerciceSeance: string
    }>
  ): Promise<ServerResponse<ExerciceSeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance, idExerciceSeance } = serverRequest.payload
    const exerciceSeance = await this.recupererExerciceSeanceUseCase.execute(idSeance, idExerciceSeance)
    return success(presenterEnExerciceSeanceContrat(exerciceSeance))
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async definirSerieExerciceSeance(
    serverRequest: ServerRequest<{
      idSeance: string
      idExerciceSeance: string
      listeSerieExerciceSeance: SerieExerciceSeancePayload[]
    }>
  ): Promise<ServerResponse<void>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance, idExerciceSeance, listeSerieExerciceSeance } = serverRequest.payload
    await this.definirSerieExerciceSeanceUseCase.execute(idSeance, idExerciceSeance, listeSerieExerciceSeance)
    return success()
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async modifierTempsDeRepos(
    serverRequest: ServerRequest<{
      idExerciceSeance: string
      tempsRepos: number
    }>
  ): Promise<ServerResponse<void>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idExerciceSeance, tempsRepos } = serverRequest.payload
    await this.definirTempsReposExerciceSeanceUseCase.execute({ idExerciceSeance, tempsRepos })
    return updated()
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
    tempsRepos: exerciceSeance.tempsRepos,
    listeSerieExerciceSeance: exerciceSeance.listeSerieExerciceSeance.map(presenterEnSerieExerciceSeanceContrat)
  }
}
