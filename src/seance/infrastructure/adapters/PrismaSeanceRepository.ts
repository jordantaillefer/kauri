import { Seance } from "../../domain/Seance"
import { prisma } from "../../../db/prisma"
import { Seance as SeanceModel } from "@prisma/client"
import { SeanceNotFoundError } from "../../domain/errors/SeanceNotFoundError"

function convertirEnModel(seance: Seance): SeanceModel {
  return {
    id: seance.id,
    idUtilisateur: seance.idUtilisateur,
    nomSeance: seance.nomSeance
  }
}

function convertirEnSeance(seanceModel: SeanceModel): Seance {
  return Seance.creerSeance({
    id: seanceModel.id,
    idUtilisateur: seanceModel.idUtilisateur,
    nomSeance: seanceModel.nomSeance
  })
}

export class PrismaSeanceRepository {
  async creerSeance(seance: Seance) {
    const seanceModel = convertirEnModel(seance)
    await prisma.seance.create({
      data: {
        id: seanceModel.id,
        nomSeance: seanceModel.nomSeance,
        idUtilisateur: seanceModel.idUtilisateur
      }
    })
  }

  async recupererParId(idSeance: string): Promise<Seance> {
    const seanceModel = await prisma.seance.findUnique({
      where: { id: idSeance }
    })
    if (seanceModel === null) {
      throw new SeanceNotFoundError()
    }
    const seance = convertirEnSeance(seanceModel)
    return seance
  }
}