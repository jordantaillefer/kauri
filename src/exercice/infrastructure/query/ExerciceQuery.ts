import { Exercice } from "@prisma/client"

import { ExerciceContrat, ListeExerciceContrat } from "api"
import type { ServerRequestWithoutPayload } from "api/app/ServerRequest"
import { ServerResponse, success } from "api/app/ServerResponse"
import { Controller } from "api/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "api/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "api/app/decorators/ProduceServerResponseDecorator"
import { prisma } from "api/db/prisma";

@Controller()
export class ExerciceQuery {
  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async listerExercice(serverRequest: ServerRequestWithoutPayload): Promise<ServerResponse<ListeExerciceContrat>> {
    const listeExerciceModels = await prisma.exercice.findMany()
    return success(presenterEnMapExerciceContrat(listeExerciceModels))
  }
}

function presenterEnMapExerciceContrat(listeExercice: Exercice[]): ListeExerciceContrat {
  return listeExercice.reduce((acc, value) => {
    acc.set(value.categorie,
      [...(acc.get(value.categorie) || []),
        {
          id: value.id,
          nomExercice: value.nomExercice,
          categorie: value.categorie
        }
      ]
    )
    return acc
  }, new Map<string, ExerciceContrat[]>())
}