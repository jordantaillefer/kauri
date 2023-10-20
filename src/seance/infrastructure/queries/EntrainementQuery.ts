import {
  Entrainement,
  ExerciceEntrainement,
  SerieEntrainement
} from "@prisma/client"
import invariant from "tiny-invariant"

import type { ServerRequest, ServerRequestWithoutPayload } from "api/app/ServerRequest"
import { ServerResponse, success } from "api/app/ServerResponse"
import {
  DetailEntrainementContrat,
  EntrainementContrat,
  ExerciceEntrainementContrat,
  SerieEntrainementContrat
} from "api/app/contrats/EntrainementContrat";
import { Controller } from "api/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "api/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "api/app/decorators/ProduceServerResponseDecorator"
import { prisma } from "api/db/prisma";
import { EntrainementNotFoundError } from "api/seance/domain/errors/EntrainementNotFoundError";

@Controller()
export class EntrainementQuery {
  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async recupererEntrainementParId(
    serverRequest: ServerRequest<{ idEntrainement: string }>
  ): Promise<ServerResponse<DetailEntrainementContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idEntrainement } = serverRequest.payload

    const entrainementModel = await prisma.entrainement.findUnique({
      where: { id: idEntrainement },
      include: {
        exerciceEntrainements: {
          orderBy: { ordre: "asc" },
          include: {
            serieEntrainements: { orderBy: { ordre: "asc" } }
          }
        }
      }
    })

    if (!entrainementModel) {
      throw new EntrainementNotFoundError()
    }

    return success(presenterEnDetailEntrainementContrat(entrainementModel))
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async listerEntrainement(serverRequest: ServerRequestWithoutPayload): Promise<ServerResponse<EntrainementContrat[]>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const listeEntrainement = await prisma.entrainement.findMany({
      where: { idUtilisateur: serverRequest.compteUtilisateurConnecte.id }
    })
    return success(listeEntrainement.map(entrainement => presenterEnEntrainementContrat(entrainement)))
  }
}

const presenterEnEntrainementContrat = (entrainement: Entrainement): EntrainementContrat => {
  return {
    id: entrainement.id,
    nomSeance: entrainement.nomSeance,
  }
}

const presenterEnDetailEntrainementContrat = (
  entrainement: Entrainement & {
    exerciceEntrainements: (
      ExerciceEntrainement & { serieEntrainements: SerieEntrainement[] }
      )[]
  }
): DetailEntrainementContrat => {
  return {
    id: entrainement.id,
    nomSeance: entrainement.nomSeance,
    listeExerciceEntrainement: entrainement.exerciceEntrainements.map(presenterEnExerciceEntrainementContrat)
  }
}

const presenterEnExerciceEntrainementContrat = (
  exerciceEntrainement: ExerciceEntrainement & { serieEntrainements: SerieEntrainement[] }
): ExerciceEntrainementContrat => {
  return {
    id: exerciceEntrainement.id,
    nomExercice: exerciceEntrainement.nomExercice,
    categorie: exerciceEntrainement.categorie,
    estRealise: exerciceEntrainement.estRealise,
    tempsRepos: exerciceEntrainement.tempsRepos,
    ordre: exerciceEntrainement.ordre,
    listeSerieEntrainement: exerciceEntrainement.serieEntrainements.map(presenterEnSerieEntrainement)
  }
}

const presenterEnSerieEntrainement = (serieEntrainement: SerieEntrainement): SerieEntrainementContrat => {
  return {
    id: serieEntrainement.id,
    nombreRepetition: serieEntrainement.nombreRepetition,
    ordre: serieEntrainement.ordre,
    estRealise: serieEntrainement.estRealise
  }
}
