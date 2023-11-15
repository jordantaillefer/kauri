import invariant from "tiny-invariant"

import type { ExerciceSeance } from "../../domain/ExerciceSeance"
import type { SerieExerciceSeance } from "../../domain/SerieExerciceSeance"
import type { InitialiserExerciceSeanceUseCase } from "../../usecases/InitialiserExerciceSeanceUseCase"
import type { ExerciceSeanceContrat, SerieExerciceSeanceContrat } from "app/server"
import type { ServerRequest } from "~/server/app/ServerRequest"
import type { ServerResponse } from "~/server/app/ServerResponse";
import { created } from "~/server/app/ServerResponse"
import { Controller } from "~/server/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "~/server/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "~/server/app/decorators/ProduceServerResponseDecorator"

interface Dependencies {
  initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
}

@Controller()
export class ExerciceSeanceController {
  private initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase

  constructor({
    initialiserExerciceSeanceUseCase,
  }: Dependencies) {
    this.initialiserExerciceSeanceUseCase = initialiserExerciceSeanceUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async creerExerciceSeance(
    serverRequest: ServerRequest<{
      idSeance: string
      idExercice: string,
      tempsRepos: number,
      series: number[]
    }>
  ): Promise<ServerResponse<ExerciceSeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance, idExercice, tempsRepos, series } = serverRequest.payload
    const exerciceSeance = await this.initialiserExerciceSeanceUseCase.execute({ idSeance, idExercice, tempsRepos, series })
    return created(presenterEnExerciceSeanceContrat(exerciceSeance))
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
