import { Seance as SeanceModel } from "@prisma/client"

import { prisma } from "../../../db/prisma"
import { IdUtilisateur, Seance } from "../../domain/Seance"
import { SeanceNotFoundError } from "../../domain/errors/SeanceNotFoundError"
import { SeanceRepository } from "../../domain/ports/SeanceRepository"

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

export class PrismaSeanceRepository implements SeanceRepository {
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
    return convertirEnSeance(seanceModel)
  }

  async recupererTout(idUtilisateur: IdUtilisateur): Promise<Seance[]> {
    const listeDeProgrammesModels = await prisma.seance.findMany({
      where: { idUtilisateur }
    })
    return listeDeProgrammesModels.map(convertirEnSeance)
  }
}