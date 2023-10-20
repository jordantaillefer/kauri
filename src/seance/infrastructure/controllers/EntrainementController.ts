import invariant from "tiny-invariant"

import { Entrainement } from "../../domain/Entrainement"
import { ExerciceEntrainement } from "../../domain/ExerciceEntrainement"
import { SerieEntrainement } from "../../domain/SerieEntrainement"
import { DemarrerEntrainementUseCase } from "../../usecases/DemarrerEntrainementUseCase"
import { RealiserSerieUseCase } from "../../usecases/RealiserSerieUseCase"
import type { ServerRequest } from "api/app/ServerRequest"
import { created, ServerResponse, updated } from "api/app/ServerResponse"
import {
  DetailEntrainementContrat,
  ExerciceEntrainementContrat,
  SerieEntrainementContrat
} from "api/app/contrats/EntrainementContrat";
import { Controller } from "api/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "api/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "api/app/decorators/ProduceServerResponseDecorator"

interface Dependencies {
  demarrerEntrainementUseCase: DemarrerEntrainementUseCase
  realiserSerieUseCase: RealiserSerieUseCase
}

@Controller()
export class EntrainementController {
  private demarrerEntrainementUseCase: DemarrerEntrainementUseCase
  private realiserSerieUseCase: RealiserSerieUseCase

  constructor({
    demarrerEntrainementUseCase,
    realiserSerieUseCase,
  }: Dependencies) {
    this.demarrerEntrainementUseCase = demarrerEntrainementUseCase
    this.realiserSerieUseCase = realiserSerieUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async demarrerEntrainement(
    serverRequest: ServerRequest<{ idSeance: string }>
  ): Promise<ServerResponse<DetailEntrainementContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance } = serverRequest.payload
    const nouvelEntrainement = await this.demarrerEntrainementUseCase.execute({
      idUtilisateur: serverRequest.compteUtilisateurConnecte.id,
      idSeance
    })
    return created(presenterEnEntrainementContrat(nouvelEntrainement))
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async realiserSerie(
    serverRequest: ServerRequest<{ idSerie: string; idExercice: string }>
  ): Promise<ServerResponse<void>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSerie, idExercice } = serverRequest.payload
    await this.realiserSerieUseCase.execute({
      idUtilisateur: serverRequest.compteUtilisateurConnecte.id,
      idSerie,
      idExercice
    })
    return updated()
  }
}

function presenterEnEntrainementContrat(entrainement: Entrainement): DetailEntrainementContrat {
  return {
    id: entrainement.id,
    nomSeance: entrainement.nomSeance,
    listeExerciceEntrainement: entrainement.listeExerciceEntrainement.map(presenterEnExerciceEntrainementContrat)
  }
}

function presenterEnExerciceEntrainementContrat(
  exerciceEntrainement: ExerciceEntrainement
): ExerciceEntrainementContrat {
  return {
    id: exerciceEntrainement.id,
    nomExercice: exerciceEntrainement.nomExercice,
    categorie: exerciceEntrainement.categorie,
    estRealise: exerciceEntrainement.estRealise,
    tempsRepos: exerciceEntrainement.tempsRepos,
    ordre: exerciceEntrainement.ordre,
    listeSerieEntrainement: exerciceEntrainement.listeSerieEntrainement.map(presenterEnSerieEntrainement)
  }
}

function presenterEnSerieEntrainement(serieEntrainement: SerieEntrainement): SerieEntrainementContrat {
  return {
    id: serieEntrainement.id,
    nombreRepetition: serieEntrainement.nombreRepetition,
    ordre: serieEntrainement.ordre,
    estRealise: serieEntrainement.estRealise
  }
}
