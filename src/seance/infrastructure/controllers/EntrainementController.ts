import invariant from "tiny-invariant"

import { ServerRequest, ServerRequestWithoutPayload } from "../../../app/ServerRequest"
import { created, ServerResponse, success, updated } from "../../../app/ServerResponse"
import {
  EntrainementContrat,
  ExerciceEntrainementContrat,
  SerieEntrainementContrat
} from "../../../app/contrats/EntrainementContrat"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { Entrainement } from "../../domain/Entrainement"
import { ExerciceEntrainement } from "../../domain/ExerciceEntrainement"
import { SerieEntrainement } from "../../domain/SerieEntrainement"
import { DemarrerEntrainementUseCase } from "../../usecases/DemarrerEntrainementUseCase"
import { ListerEntrainementUseCase } from "../../usecases/ListerEntrainementUseCase"
import { RealiserSerieUseCase } from "../../usecases/RealiserSerieUseCase"
import { RecupererEntrainementUseCase } from "../../usecases/RecupererEntrainementUseCase"

interface Dependencies {
  listerEntrainementUseCase: ListerEntrainementUseCase
  demarrerEntrainementUseCase: DemarrerEntrainementUseCase
  realiserSerieUseCase: RealiserSerieUseCase
  recupererEntrainementUseCase: RecupererEntrainementUseCase
}

@Controller()
export class EntrainementController {
  private listerEntrainementUseCase: ListerEntrainementUseCase
  private demarrerEntrainementUseCase: DemarrerEntrainementUseCase
  private recupererEntrainementUseCase: RecupererEntrainementUseCase
  private realiserSerieUseCase: RealiserSerieUseCase

  constructor({
    demarrerEntrainementUseCase,
    realiserSerieUseCase,
    recupererEntrainementUseCase,
    listerEntrainementUseCase
  }: Dependencies) {
    this.listerEntrainementUseCase = listerEntrainementUseCase
    this.demarrerEntrainementUseCase = demarrerEntrainementUseCase
    this.realiserSerieUseCase = realiserSerieUseCase
    this.recupererEntrainementUseCase = recupererEntrainementUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async demarrerEntrainement(
    serverRequest: ServerRequest<{ idSeance: string }>
  ): Promise<ServerResponse<EntrainementContrat>> {
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
  async recupererEntrainementParId(
    serverRequest: ServerRequest<{ idEntrainement: string }>
  ): Promise<ServerResponse<EntrainementContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idEntrainement } = serverRequest.payload
    const entrainementResult = await this.recupererEntrainementUseCase.execute({
      idUtilisateur: serverRequest.compteUtilisateurConnecte.id,
      idEntrainement
    })
    return success(presenterEnEntrainementContrat(entrainementResult))
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

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async listerEntrainement(serverRequest: ServerRequestWithoutPayload): Promise<ServerResponse<EntrainementContrat[]>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const listeSeance = await this.listerEntrainementUseCase.execute(serverRequest.compteUtilisateurConnecte.id)
    return success(listeSeance.map(presenterEnEntrainementContrat))
  }
}

function presenterEnEntrainementContrat(entrainement: Entrainement): EntrainementContrat {
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
