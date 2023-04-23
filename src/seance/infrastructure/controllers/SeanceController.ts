import invariant from "tiny-invariant"

import { ServerRequest, ServerRequestWithoutPayload } from "../../../app/ServerRequest"
import { created, ServerResponse, success, updated } from "../../../app/ServerResponse";
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
import { ModifierNomSeanceUseCase } from "../../usecases/ModifierNomSeanceUseCase"
import { RecupererDetailSeanceUseCase } from "../../usecases/RecupererDetailSeanceUseCase"
import { RecupererSeanceUseCase } from "../../usecases/RecupererSeanceUseCase"
import { ExerciceSeanceContrat, SeanceContrat } from "api"

interface Dependencies {
  initialiserSeanceUseCase: InitialiserSeanceUseCase
  listerSeanceUseCase: ListerSeanceUseCase
  recupererSeanceUseCase: RecupererSeanceUseCase
  recupererDetailSeanceUseCase: RecupererDetailSeanceUseCase
  modifierNomSeanceUseCase: ModifierNomSeanceUseCase
}

@Controller()
export class SeanceController {
  private initialiserSeanceUseCase: InitialiserSeanceUseCase
  private listerSeanceUseCase: ListerSeanceUseCase
  private recupererSeanceUseCase: RecupererSeanceUseCase
  private recupererDetailSeanceUseCase: RecupererDetailSeanceUseCase
  private modifierNomSeanceUseCase: ModifierNomSeanceUseCase

  constructor({
    initialiserSeanceUseCase,
    listerSeanceUseCase,
    recupererSeanceUseCase,
    recupererDetailSeanceUseCase,
    modifierNomSeanceUseCase
  }: Dependencies) {
    this.initialiserSeanceUseCase = initialiserSeanceUseCase
    this.listerSeanceUseCase = listerSeanceUseCase
    this.recupererSeanceUseCase = recupererSeanceUseCase
    this.recupererDetailSeanceUseCase = recupererDetailSeanceUseCase
    this.modifierNomSeanceUseCase = modifierNomSeanceUseCase
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

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async mettreAJourNomSeance(
    serverRequest: ServerRequest<{ idSeance: string; nomSeance: string }>
  ): Promise<ServerResponse<void>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance, nomSeance } = serverRequest.payload
    await this.modifierNomSeanceUseCase.execute({
      idSeance,
      nouveauNomSeance: nomSeance
    })
    return updated()
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
    tempsRepos: detailExerciceSeance.tempsRepos,
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
