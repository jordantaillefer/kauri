import invariant from "tiny-invariant"

import { ServerRequest, ServerRequestWithoutPayload } from "../../../app/ServerRequest"
import { created, ServerResponse, success } from "../../../app/ServerResponse"
import {
  DetailExerciceContrat,
  DetailSeanceContrat,
  DetailSerieContrat
} from "../../../app/contrats/DetailSeanceContrat"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { DetailExercice } from "../../domain/DetailExercice"
import { DetailSeance } from "../../domain/DetailSeance"
import { DetailSerie } from "../../domain/DetailSerie"
import { ExerciceSeance } from "../../domain/ExerciceSeance"
import { Seance } from "../../domain/Seance"
import { InitialiserSeanceUseCase } from "../../usecases/InitialiserSeanceUseCase"
import { ListerSeanceUseCase } from "../../usecases/ListerSeanceUseCase"
import { RecupererDetailSeanceUseCase } from "../../usecases/RecupererDetailSeanceUseCase"
import { RecupererSeanceUseCase } from "../../usecases/RecupererSeanceUseCase"
import { ExerciceSeanceContrat, SeanceContrat } from "api"

interface Dependencies {
  initialiserSeanceUseCase: InitialiserSeanceUseCase
  listerSeanceUseCase: ListerSeanceUseCase
  recupererSeanceUseCase: RecupererSeanceUseCase
  recupererDetailSeanceUseCase: RecupererDetailSeanceUseCase
}

@Controller()
export class SeanceController {
  private initialiserSeanceUseCase: InitialiserSeanceUseCase
  private listerSeanceUseCase: ListerSeanceUseCase
  private recupererSeanceUseCase: RecupererSeanceUseCase
  private recupererDetailSeanceUseCase: RecupererDetailSeanceUseCase

  constructor({
    initialiserSeanceUseCase,
    listerSeanceUseCase,
    recupererSeanceUseCase,
    recupererDetailSeanceUseCase
  }: Dependencies) {
    this.initialiserSeanceUseCase = initialiserSeanceUseCase
    this.listerSeanceUseCase = listerSeanceUseCase
    this.recupererSeanceUseCase = recupererSeanceUseCase
    this.recupererDetailSeanceUseCase = recupererDetailSeanceUseCase
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
  async recupererSeanceParId(
    serverRequest: ServerRequest<{ idSeance: string }>
  ): Promise<ServerResponse<SeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance } = serverRequest.payload
    const seanceResult = await this.recupererSeanceUseCase.execute(serverRequest.compteUtilisateurConnecte.id, idSeance)
    return success(presenterEnSeanceContrat(seanceResult))
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async recupererDetailSeanceParId(
    serverRequest: ServerRequest<{ idSeance: string }>
  ): Promise<ServerResponse<DetailSeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance } = serverRequest.payload
    const seanceResult = await this.recupererDetailSeanceUseCase.execute({
      idUtilisateur: serverRequest.compteUtilisateurConnecte.id,
      idSeance
    })
    return success(presenterEnDetailSeanceContrat(seanceResult))
  }
}

function presenterEnExerciceSeanceContrat(exerciceSeance: ExerciceSeance): ExerciceSeanceContrat {
  return {
    id: exerciceSeance.id,
    nomExercice: exerciceSeance.nomExercice,
    categorie: exerciceSeance.categorie,
    idExercice: exerciceSeance.idExercice,
    ordre: exerciceSeance.ordre,
    listeSerieExerciceSeance: []
  }
}

function presenterEnSeanceContrat(seance: Seance): SeanceContrat {
  return {
    id: seance.id,
    nomSeance: seance.nomSeance,
    exerciceSeances: seance.exerciceSeances.map(presenterEnExerciceSeanceContrat)
  }
}

function presenterEnDetailSerieSeanceContrat(detailSerie: DetailSerie): DetailSerieContrat {
  return {
    repetitions: detailSerie.nombreRepetition,
    ordre: detailSerie.ordre
  }
}

function presenterEnDetailExerciceSeanceContrat(detailExerciceSeance: DetailExercice): DetailExerciceContrat {
  return {
    nomExercice: detailExerciceSeance.nomExercice,
    categorie: detailExerciceSeance.categorie,
    ordre: detailExerciceSeance.ordre,
    series: detailExerciceSeance.listeDetailSerie.map(presenterEnDetailSerieSeanceContrat)
  }
}

function presenterEnDetailSeanceContrat(detailSeance: DetailSeance): DetailSeanceContrat {
  return {
    id: detailSeance.id,
    nomSeance: detailSeance.nomSeance,
    exerciceSeances: detailSeance.listeDetailExercice.map(presenterEnDetailExerciceSeanceContrat)
  }
}
