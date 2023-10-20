import { ExerciceSeance, Seance, SerieExerciceSeance } from "@prisma/client"
import invariant from "tiny-invariant"

import { ExerciceSeanceContrat, SeanceContrat } from "api"
import type { ServerRequest, ServerRequestWithoutPayload } from "api/app/ServerRequest"
import { ServerResponse, success } from "api/app/ServerResponse";
import {
  DetailExerciceContrat,
  DetailSeanceContrat,
  DetailSerieContrat
} from "api/app/contrats/DetailSeanceContrat"
import { Controller } from "api/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "api/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "api/app/decorators/ProduceServerResponseDecorator"
import { prisma } from "api/db/prisma";
import { CATEGORIE } from "api/exercice/domain/categorie";
import { SeanceNotFoundError } from "api/seance/domain/errors/SeanceNotFoundError";

@Controller()
export class SeanceQuery {
  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async listerSeance(serverRequest: ServerRequestWithoutPayload): Promise<ServerResponse<SeanceContrat[]>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const listeDeSeanceModels = await prisma.seance.findMany({
      where: { idUtilisateur: serverRequest.compteUtilisateurConnecte.id },
      include: { exerciceSeances: true }
    })
    return success(listeDeSeanceModels.map(presenterEnSeanceContrat))
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async recupererSeanceParId(
    serverRequest: ServerRequest<{ idSeance: string }>
  ): Promise<ServerResponse<SeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance } = serverRequest.payload
    const seanceModel = await prisma.seance.findUnique({
      where: { id: idSeance },
      include: {
        exerciceSeances: {
          orderBy: { ordre: "asc" }
        }
      }
    })
    if (seanceModel === null) {
      throw new SeanceNotFoundError()
    }
    return success(presenterEnSeanceContrat(seanceModel))
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async recupererDetailSeanceParId(
    serverRequest: ServerRequest<{ idSeance: string }>
  ): Promise<ServerResponse<DetailSeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance } = serverRequest.payload
    const detailSeanceModel = await prisma.seance.findUnique({
      where: { id: idSeance },
      include: {
        exerciceSeances: {
          orderBy: { ordre: "asc" },
          include: {
            serieExerciceSeances: { orderBy: { ordre: "asc" } }
          }
        }
      }
    })
    if (detailSeanceModel === null) {
      throw new SeanceNotFoundError()
    }

    return success(presenterEnDetailSeanceContrat(detailSeanceModel))
  }
}

function presenterEnExerciceSeanceContrat(exerciceSeance: ExerciceSeance): ExerciceSeanceContrat {
  return {
    id: exerciceSeance.id,
    nomExercice: exerciceSeance.nomExercice,
    categorie: exerciceSeance.categorie as CATEGORIE,
    idExercice: exerciceSeance.idExercice,
    ordre: exerciceSeance.ordre,
    tempsRepos: exerciceSeance.tempsRepos,
    listeSerieExerciceSeance: []
  }
}

function presenterEnSeanceContrat(seance: Seance & { exerciceSeances: ExerciceSeance[] }): SeanceContrat {
  return {
    id: seance.id,
    nomSeance: seance.nomSeance,
    exerciceSeances: seance.exerciceSeances.map(presenterEnExerciceSeanceContrat)
  }
}

function presenterEnDetailSerieSeanceContrat(serieExerciceSeance: SerieExerciceSeance): DetailSerieContrat {
  return {
    repetitions: serieExerciceSeance.repetitions,
    ordre: serieExerciceSeance.ordre
  }
}

function presenterEnDetailExerciceSeanceContrat(exerciceSeance: ExerciceSeance & { serieExerciceSeances: SerieExerciceSeance[] }): DetailExerciceContrat {
  return {
    nomExercice: exerciceSeance.nomExercice,
    categorie: exerciceSeance.categorie,
    ordre: exerciceSeance.ordre,
    tempsRepos: exerciceSeance.tempsRepos,
    series: exerciceSeance.serieExerciceSeances.map(presenterEnDetailSerieSeanceContrat)
  }
}

function presenterEnDetailSeanceContrat(seance: Seance & { exerciceSeances: (ExerciceSeance & { serieExerciceSeances: SerieExerciceSeance[] })[] }): DetailSeanceContrat {
  return {
    id: seance.id,
    nomSeance: seance.nomSeance,
    exerciceSeances: seance.exerciceSeances.map(presenterEnDetailExerciceSeanceContrat)
  }
}
