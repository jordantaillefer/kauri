import invariant from "tiny-invariant"

import { ServerRequest, ServerRequestWithoutPayload } from "../../../app/ServerRequest"
import { created, ServerResponse, success } from "../../../app/ServerResponse"
import {
  DetailExerciceContrat,
  DetailSeanceContrat,
  DetailSerieContrat
} from "../../../app/contrats/DetailSeanceContrat"
import {
  EntrainementContrat,
  ExerciceEntrainementContrat,
  SerieEntrainementContrat
} from "../../../app/contrats/EntrainementContrat"
import { Controller } from "../../../app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "../../../app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "../../../app/decorators/ProduceServerResponseDecorator"
import { DetailExercice } from "../../domain/DetailExercice"
import { DetailSeance } from "../../domain/DetailSeance"
import { DetailSerie } from "../../domain/DetailSerie"
import { Entrainement } from "../../domain/Entrainement"
import { ExerciceEntrainement } from "../../domain/ExerciceEntrainement"
import { ExerciceSeance } from "../../domain/ExerciceSeance"
import { Seance } from "../../domain/Seance"
import { SerieEntrainement } from "../../domain/SerieEntrainement"
import { DemarrerEntrainementUseCase } from "../../usecases/DemarrerEntrainementUseCase"
import { InitialiserSeanceUseCase } from "../../usecases/InitialiserSeanceUseCase"
import { ListerSeanceUseCase } from "../../usecases/ListerSeanceUseCase"
import { RecupererDetailSeanceUseCase } from "../../usecases/RecupererDetailSeanceUseCase"
import { RecupererEntrainementUseCase } from "../../usecases/RecupererEntrainementUseCase"
import { RecupererSeanceUseCase } from "../../usecases/RecupererSeanceUseCase"
import { ExerciceSeanceContrat, SeanceContrat } from "api"

interface Dependencies {
  initialiserSeanceUseCase: InitialiserSeanceUseCase
  listerSeanceUseCase: ListerSeanceUseCase
  recupererSeanceUseCase: RecupererSeanceUseCase
  recupererDetailSeanceUseCase: RecupererDetailSeanceUseCase
  demarrerEntrainementUseCase: DemarrerEntrainementUseCase
  recupererEntrainementUseCase: RecupererEntrainementUseCase
}

@Controller()
export class SeanceController {
  private initialiserSeanceUseCase: InitialiserSeanceUseCase
  private listerSeanceUseCase: ListerSeanceUseCase
  private recupererSeanceUseCase: RecupererSeanceUseCase
  private recupererDetailSeanceUseCase: RecupererDetailSeanceUseCase
  private demarrerEntrainementUseCase: DemarrerEntrainementUseCase
  private recupererEntrainementUseCase: RecupererEntrainementUseCase

  constructor({
                initialiserSeanceUseCase,
                listerSeanceUseCase,
                recupererSeanceUseCase,
                recupererDetailSeanceUseCase,
                demarrerEntrainementUseCase,
                recupererEntrainementUseCase
              }: Dependencies) {
    this.initialiserSeanceUseCase = initialiserSeanceUseCase
    this.listerSeanceUseCase = listerSeanceUseCase
    this.recupererSeanceUseCase = recupererSeanceUseCase
    this.recupererDetailSeanceUseCase = recupererDetailSeanceUseCase
    this.demarrerEntrainementUseCase = demarrerEntrainementUseCase
    this.recupererEntrainementUseCase = recupererEntrainementUseCase
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

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async recupererDetailSeanceParId(serverRequest: ServerRequest<{ idSeance: string }>): Promise<ServerResponse<DetailSeanceContrat>> {
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
  async demarrerEntrainement(serverRequest: ServerRequest<{ idSeance: string }>): Promise<ServerResponse<void>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance } = serverRequest.payload
    await this.demarrerEntrainementUseCase.execute({
      idUtilisateur: serverRequest.compteUtilisateurConnecte.id,
      idSeance
    })
    return created()
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async recupererEntrainementParId(serverRequest: ServerRequest<{ idEntrainement: string }>): Promise<ServerResponse<EntrainementContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idEntrainement } = serverRequest.payload
    const entrainementResult = await this.recupererEntrainementUseCase.execute({
      idUtilisateur: serverRequest.compteUtilisateurConnecte.id,
      idEntrainement
    })
    return success(presenterEnEntrainementContrat(entrainementResult))
  }
}

function presenterEnExerciceSeanceContrat(exerciceSeance: ExerciceSeance): ExerciceSeanceContrat {
  return {
    id: exerciceSeance.id,
    nomExercice: exerciceSeance.nomExercice,
    categorie: exerciceSeance.categorie,
    idExercice: exerciceSeance.idExercice,
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
    repetitions: detailSerie.nombreRepetition
  }
}

function presenterEnDetailExerciceSeanceContrat(detailExerciceSeance: DetailExercice): DetailExerciceContrat {
  return {
    nomExercice: detailExerciceSeance.nomExercice,
    categorie: detailExerciceSeance.categorie,
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

function presenterEnEntrainementContrat(entrainement: Entrainement): EntrainementContrat {
  return {
    id: entrainement.id,
    nomSeance: entrainement.nomSeance,
    listeExerciceEntrainement: entrainement.listeExerciceEntrainement.map(presenterEnExerciceEntrainementContrat)
  }
}

function presenterEnExerciceEntrainementContrat(exerciceEntrainement: ExerciceEntrainement): ExerciceEntrainementContrat {
  return {
    id: exerciceEntrainement.id,
    nomExercice: exerciceEntrainement.nomExercice,
    categorie: exerciceEntrainement.categorie,
    estRealise: exerciceEntrainement.estRealise,
    tempsRepos: exerciceEntrainement.tempsRepos,
    listeSerieEntrainement: exerciceEntrainement.listeSerieEntrainement.map(presenterEnSerieEntrainement)
  }
}

function presenterEnSerieEntrainement(serieEntrainement: SerieEntrainement): SerieEntrainementContrat {
  return {
    id: serieEntrainement.id,
    nombreRepetition: serieEntrainement.nombreRepetition
  }
}
