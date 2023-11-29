import invariant from "tiny-invariant"

import type { Entrainement } from "../../domain/Entrainement"
import type { ExerciceEntrainement } from "../../domain/ExerciceEntrainement"
import type { SerieEntrainement } from "../../domain/SerieEntrainement"
import type { DemarrerEntrainementUseCase } from "../../usecases/DemarrerEntrainementUseCase"
import type { RealiserSerieUseCase } from "../../usecases/RealiserSerieUseCase"
import type { ServerRequest } from "~/server/app/ServerRequest"
import type { ServerResponse} from "~/server/app/ServerResponse";
import { created, updated } from "~/server/app/ServerResponse"
import type {
  DetailEntrainementContrat,
  ExerciceEntrainementContrat,
  SerieEntrainementContrat
} from "~/server/app/contrats/EntrainementContrat";
import { Controller } from "~/server/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "~/server/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "~/server/app/decorators/ProduceServerResponseDecorator"

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
    serverRequest: ServerRequest<{ idSerieEntrainement: string; idExerciceEntrainement: string }>
  ): Promise<ServerResponse<void>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSerieEntrainement, idExerciceEntrainement } = serverRequest.payload
    await this.realiserSerieUseCase.execute({
      idUtilisateur: serverRequest.compteUtilisateurConnecte.id,
      idSerieEntrainement,
      idExerciceEntrainement: idExerciceEntrainement
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
    ordre: exerciceEntrainement.ordre,
    series: exerciceEntrainement.listeSerieEntrainement.map(presenterEnSerieEntrainement)
  }
}

function presenterEnSerieEntrainement(serieEntrainement: SerieEntrainement): SerieEntrainementContrat {
  return {
    id: serieEntrainement.id,
    repetitions: serieEntrainement.nombreRepetition,
    tempsRepos: serieEntrainement.tempsRepos,
    ordre: serieEntrainement.ordre,
    estRealise: serieEntrainement.estRealise
  }
}
