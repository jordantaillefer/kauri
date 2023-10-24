import invariant from "tiny-invariant"

import type { ServerRequest, ServerRequestWithoutPayload } from "~/server/app/ServerRequest";
import type { ServerResponse } from "~/server/app/ServerResponse"
import { success } from "~/server/app/ServerResponse"
import type { SportifEvenementContrat } from "~/server/app/contrats/SportifEvenementContrat";
import { presenterEnContrat } from "~/server/app/contrats/SportifEvenementContrat"
import { Controller } from "~/server/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "~/server/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "~/server/app/decorators/ProduceServerResponseDecorator"
import { prisma } from "~/server/db/prisma"

@Controller()
export class SportifQuery {
  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async listerEvenement({
    compteUtilisateurConnecte,
  }: ServerRequestWithoutPayload): Promise<ServerResponse<SportifEvenementContrat[]>> {
    invariant(compteUtilisateurConnecte)

    const listeEvenementsModels = await prisma.sportifEvenement.findMany({
      where: {
        idUtilisateur: compteUtilisateurConnecte.id
      },
      orderBy: {
        tempsEvenement: "asc"
      }
    })
    return success(listeEvenementsModels.map(presenterEnContrat))
  }
  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async listerEvenementParDate({
    compteUtilisateurConnecte,
    payload
  }: ServerRequest<{ date: string }>): Promise<ServerResponse<SportifEvenementContrat[]>> {
    invariant(compteUtilisateurConnecte)

    const { date } = payload;

    const listeEvenementsModels = await prisma.sportifEvenement.findMany({
      where: {
        idUtilisateur: compteUtilisateurConnecte.id,
        tempsEvenement: {
          startsWith: date
        }
      }
    })
    return success(listeEvenementsModels.map(presenterEnContrat))
  }
}
