import { SeanceEntrainement as SeanceEntrainementModel } from "@prisma/client"

import { prisma } from "../../../db/prisma"
import { SeanceEntrainement } from "../../domain/SeanceEntrainement"
import { SeanceEntrainementRepository } from "../../domain/ports/SeanceEntrainementRepository"

export class PrismaSeanceEntrainementRepository implements SeanceEntrainementRepository {
  async creerSeanceEntrainement(idProgramme: string, seanceEntrainement: SeanceEntrainement): Promise<void> {
    const seanceEntrainementModel = convertirEnModel(idProgramme, seanceEntrainement)
    await prisma.seanceEntrainement.create({
      data: seanceEntrainementModel
    })
  }

  async recupererToutParIdProgramme(idProgramme: string): Promise<SeanceEntrainement[]> {
    const listeSeanceEntrainement = await prisma.seanceEntrainement.findMany({
      where: {
        idProgramme
      }
    })

    return listeSeanceEntrainement.map(convertirEnSeanceEntrainement)
  }

  async supprimerSeanceEntrainement(idSeanceEntrainement: string) {
    try {
      await prisma.seanceEntrainement.delete({
        where: {
          id: idSeanceEntrainement
        }
      })
    } catch (error: any) {
      if (error.meta.cause !== "Record to delete does not exist.")  {
        throw error
      }
    }
  }
}

const convertirEnModel = (idProgramme: string, seanceEntrainement: SeanceEntrainement): SeanceEntrainementModel => {
  return {
    id: seanceEntrainement.id,
    idProgramme: idProgramme
  }
}

const convertirEnSeanceEntrainement = (seanceEntrainementModel: SeanceEntrainementModel): SeanceEntrainement => {
  return SeanceEntrainement.creerSeanceEntrainement({
    id: seanceEntrainementModel.id
  })
}
