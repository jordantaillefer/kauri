import type { Exercice } from "@prisma/client"

import type { ListeExerciceContrat } from "app/server"
import type { ServerRequestWithoutPayload } from "~/server/app/ServerRequest"
import type { ServerResponse} from "~/server/app/ServerResponse";
import { success } from "~/server/app/ServerResponse"
import { Controller } from "~/server/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "~/server/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "~/server/app/decorators/ProduceServerResponseDecorator"
import { prisma } from "~/server/db/prisma";

@Controller()
export class ExerciceQuery {
  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async listerExercice(serverRequest: ServerRequestWithoutPayload): Promise<ServerResponse<ListeExerciceContrat>> {
    const listeExerciceModels = await prisma.exercice.findMany({
      orderBy: { nomExercice: "asc" },
    })
    return success(presenterEnMapExerciceContrat(listeExerciceModels))
  }
}

function presenterEnMapExerciceContrat(listeExercice: Exercice[]): ListeExerciceContrat {
  return listeExercice.reduce((acc, value) => {
    acc[value.categorie] = [...(acc[value.categorie] || []),
        {
          id: value.id,
          nomExercice: value.nomExercice,
          categorie: value.categorie
        }
      ]

    return acc
  }, {} as ListeExerciceContrat)
}
