import type { Programme as ProgrammeModel, SeanceEntrainement as SeanceEntrainementModel } from "@prisma/client"

import { prisma } from "../../../db/prisma"
import { Programme } from "../../domain/Programme"
import { SeanceEntrainement } from "../../domain/SeanceEntrainement"
import { ProgrammeNotFoundError } from "../../domain/errors/ProgrammeNotFoundError"
import { ProgrammeRepository } from "../../domain/ports/ProgrammeRepository"

export class PrismaProgrammeRepository implements ProgrammeRepository {
  async creerProgramme(programme: Programme) {
    const programmeModel = convertirEnModel(programme)
    await prisma.programme.create({
      data: {
        id: programmeModel.id,
        nomProgramme: programmeModel.nomProgramme,
        idUtilisateur: programmeModel.idUtilisateur,
        seancesEntrainement: {
          create: programme.seancesEntrainement.map(convertirEnSeanceEntrainementModel)
        }
      }
    })
  }

  async recupererParId(idProgramme: string): Promise<Programme> {
    const programmeModel = await prisma.programme.findUnique({
      where: { id: idProgramme },
      include: { seancesEntrainement: true }
    })
    if (programmeModel === null) {
      throw new ProgrammeNotFoundError()
    }
    const programme = convertirEnProgramme(programmeModel)
    programme.ajouterSeancesEntrainement(...programmeModel.seancesEntrainement.map(convertirEnSeanceEntrainement))
    return programme
  }

  async recupererParIdPourLUtilisateur(idUtilisateur: string, idProgramme: string): Promise<Programme> {
    const programmeModel = await prisma.programme.findUnique({
      where: { id: idProgramme },
      include: { seancesEntrainement: true }
    })
    if (programmeModel === null || programmeModel.idUtilisateur !== idUtilisateur) {
      throw new ProgrammeNotFoundError()
    }
    const programme = convertirEnProgramme(programmeModel)
    programme.ajouterSeancesEntrainement(...programmeModel.seancesEntrainement.map(convertirEnSeanceEntrainement))
    return programme
  }

  async recupererTout(): Promise<Programme[]> {
    const listeDeProgrammesModels = await prisma.programme.findMany()
    return listeDeProgrammesModels.map(convertirEnProgramme)
  }

  async recupererToutPourLUtilisateur(idUtilisateur: string): Promise<Programme[]> {
    const listeDeProgrammesModels = await prisma.programme.findMany({
      where: {
        idUtilisateur
      }
    })
    return listeDeProgrammesModels.map(convertirEnProgramme)
  }
}

function convertirEnSeanceEntrainementModel(seanceEntrainement: SeanceEntrainement): Omit<SeanceEntrainementModel, "idProgramme"> {
  return {
    id: seanceEntrainement.id,
  }
}

function convertirEnSeanceEntrainement(seanceEntrainementModel: SeanceEntrainementModel): SeanceEntrainement {
  return SeanceEntrainement.creerSeanceEntrainement({
    id: seanceEntrainementModel.id,
  })
}

function convertirEnModel(programme: Programme): ProgrammeModel {
  return {
    id: programme.id,
    idUtilisateur: programme.idUtilisateur,
    nomProgramme: programme.nomProgramme
  }
}

function convertirEnProgramme(programmeModel: ProgrammeModel): Programme {
  return Programme.creerProgramme({
    id: programmeModel.id,
    idUtilisateur: programmeModel.idUtilisateur,
    nomProgramme: programmeModel.nomProgramme
  })
}
