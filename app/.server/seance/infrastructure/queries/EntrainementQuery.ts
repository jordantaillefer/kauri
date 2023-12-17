import type {
  Entrainement,
  ExerciceEntrainement,
  SerieEntrainement
} from "@prisma/client"
import invariant from "tiny-invariant"

import type { ServerRequest, ServerRequestWithoutPayload } from "~/.server/app/ServerRequest"
import type { ServerResponse} from "~/.server/app/ServerResponse";
import { success } from "~/.server/app/ServerResponse"
import type {
  DetailEntrainementContrat,
  EntrainementContrat,
  ExerciceEntrainementContrat,
  SerieEntrainementContrat
} from "~/.server/app/contrats/EntrainementContrat";
import { Controller } from "~/.server/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "~/.server/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "~/.server/app/decorators/ProduceServerResponseDecorator"
import { prisma } from "~/.server/db/prisma";
import { EntrainementNotFoundError } from "~/.server/seance/domain/errors/EntrainementNotFoundError";

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
    ordre: exerciceEntrainement.ordre,
    series: exerciceEntrainement.serieEntrainements.map(presenterEnSerieEntrainement)
  }
}

const presenterEnSerieEntrainement = (serieEntrainement: SerieEntrainement): SerieEntrainementContrat => {
  return {
    id: serieEntrainement.id,
    repetitions: serieEntrainement.nombreRepetition,
    poids: 0,
    tempsRepos: serieEntrainement.tempsRepos,
    ordre: serieEntrainement.ordre,
    estRealise: serieEntrainement.estRealise
  }
}
