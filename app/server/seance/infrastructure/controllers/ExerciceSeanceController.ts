import invariant from "tiny-invariant"

import type { ExerciceSeance } from "../../domain/ExerciceSeance"
import type { SerieExerciceSeance } from "../../domain/SerieExerciceSeance"
import type { InitialiserExerciceSeanceUseCase } from "../../usecases/InitialiserExerciceSeanceUseCase"
import type { ExerciceSeanceContrat, SerieExerciceSeanceContrat } from "app/server"
import type { ServerRequest } from "~/server/app/ServerRequest"
import type { ServerResponse } from "~/server/app/ServerResponse";
import { created, updated } from "~/server/app/ServerResponse";
import { Controller } from "~/server/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "~/server/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "~/server/app/decorators/ProduceServerResponseDecorator"
import type { ModifierExerciceSeanceUseCase } from "@/api/seance/usecases/ModifierExerciceSeanceUseCase";
import type { SupprimerExerciceSeanceUseCase } from "@/api/seance/usecases/SupprimerExerciceSeanceUseCase";

interface Dependencies {
  initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
  modifierExerciceSeanceUseCase: ModifierExerciceSeanceUseCase
  supprimerExerciceSeanceUseCase: SupprimerExerciceSeanceUseCase
}

@Controller()
export class ExerciceSeanceController {
  private initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
  private modifierExerciceSeanceUseCase: ModifierExerciceSeanceUseCase
  private supprimerExerciceSeanceUseCase: SupprimerExerciceSeanceUseCase

  constructor({ initialiserExerciceSeanceUseCase, modifierExerciceSeanceUseCase, supprimerExerciceSeanceUseCase }: Dependencies) {
    this.initialiserExerciceSeanceUseCase = initialiserExerciceSeanceUseCase
    this.modifierExerciceSeanceUseCase = modifierExerciceSeanceUseCase
    this.supprimerExerciceSeanceUseCase = supprimerExerciceSeanceUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async creerExerciceSeance(
    serverRequest: ServerRequest<{
      idSeance: string
      idExercice: string
      series: { repetitions: number, tempsRepos: number }[]
    }>
  ): Promise<ServerResponse<ExerciceSeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance, idExercice, series } = serverRequest.payload
    const exerciceSeance = await this.initialiserExerciceSeanceUseCase.execute({
      idSeance,
      idExercice,
      series
    })
    return created(presenterEnExerciceSeanceContrat(exerciceSeance))
  }
  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async modifierExerciceSeance(
    serverRequest: ServerRequest<{
      idSeance: string
      idExerciceSeance: string
      idExercice: string
      series: { repetitions: number, tempsRepos: number }[]
    }>
  ): Promise<ServerResponse<void>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance, idExerciceSeance, idExercice, series } = serverRequest.payload
    await this.modifierExerciceSeanceUseCase.execute({
      idSeance,
      idExerciceSeance,
      idExercice,
      series
    })
    return updated()
  }
  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async supprimerExerciceSeance(
    serverRequest: ServerRequest<{
      idExerciceSeance: string
    }>
  ): Promise<ServerResponse<void>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idExerciceSeance } = serverRequest.payload
    await this.supprimerExerciceSeanceUseCase.execute({
      idExerciceSeance,
    })
    return updated()
  }
}

function presenterEnSerieExerciceSeanceContrat(serieExerciceSeance: SerieExerciceSeance): SerieExerciceSeanceContrat {
  return {
    repetitions: serieExerciceSeance.repetitions,
    tempsRepos: serieExerciceSeance.tempsRepos
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
