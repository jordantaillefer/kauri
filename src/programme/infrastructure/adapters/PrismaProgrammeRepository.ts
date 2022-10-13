import type { Programme as ProgrammeModel } from "@prisma/client"

import { prisma } from "../../../db/prisma"
import { Programme } from "../../domain/Programme"
import { ProgrammeNotFoundError } from "../../domain/errors/ProgrammeNotFoundError"
import { ProgrammeRepository } from "./ProgrammeRepository"

export class PrismaProgrammeRepository implements ProgrammeRepository {
  async creerProgramme(programme: Programme) {
    const programmeModel = convertirEnModel(programme)
    await prisma.programme.create({ data: programmeModel })
  }

  async recupererParId(id: string): Promise<Programme> {
    const programmeModel = await prisma.programme.findUnique({ where: { id } })
    if (programmeModel === null) {
      throw new ProgrammeNotFoundError()
    }
    return convertirEnProgramme(programmeModel)
  }

  async recupererTout(): Promise<Programme[]> {
    const listeDeProgrammesModels = await prisma.programme.findMany()
    return listeDeProgrammesModels.map(convertirEnProgramme)
  }
}

function convertirEnModel(programme: Programme): ProgrammeModel {
  return {
    id: programme.id,
    userId: programme.userId,
    nomProgramme: programme.nomProgramme
  }
}

function convertirEnProgramme(programmeModel: ProgrammeModel): Programme {
  return Programme.creerProgramme({
    id: programmeModel.id,
    userId: programmeModel.userId,
    nomProgramme: programmeModel.nomProgramme
  })
}
