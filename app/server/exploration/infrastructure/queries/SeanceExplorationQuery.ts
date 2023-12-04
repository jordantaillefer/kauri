import { Controller } from "@/api/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "@/api/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "@/api/app/decorators/ProduceServerResponseDecorator"
import type { ServerRequestWithoutPayload } from "@/api/app/ServerRequest"
import type { ServerResponse } from "@/api/app/ServerResponse"
import { success } from "@/api/app/ServerResponse"
import type { SeanceExplorationContrat } from "@/api/app/contrats/SeanceExplorationContrat"
import { prisma } from "@/api/db/prisma"
import type { Seance as SeanceModel, User as UtilisateurModel } from ".prisma/client"

const presenterEnContrat = (
  listeSeanceModel: (SeanceModel & { _count: { exerciceSeances: number } })[],
  listeUtilisateurModel: UtilisateurModel[]
): SeanceExplorationContrat[] => {
  return listeSeanceModel.map(seanceModel => {
    const utilisateur = listeUtilisateurModel.find(utilisateur => utilisateur.id === seanceModel.idUtilisateur)
    return {
      id: seanceModel.id,
      nomSeance: seanceModel.nomSeance,
      nombreExercicesSeance: seanceModel._count.exerciceSeances,
      nomUtilisateur: `${utilisateur?.prenom} ${utilisateur?.nom}`
    }
  })
}

@Controller()
export class SeanceExplorationQuery {
  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async listerSeanceExploration(
    serverRequest: ServerRequestWithoutPayload
  ): Promise<ServerResponse<SeanceExplorationContrat[]>> {
    const result = await prisma.seance.findMany({
      include: {
        _count: {
          select: {
            exerciceSeances: true
          }
        }
      }
    })
    const resultUtilisateur = await prisma.user.findMany({
      where: {
        id: {
          in: result.map(seanceModel => seanceModel.idUtilisateur)
        }
      }
    })

    return success(presenterEnContrat(result, resultUtilisateur))
  }
}
