import type { Programme as ProgrammeModel } from "@prisma/client"

import { prisma } from "../../../db/prisma"
import { Programme } from "../../domain/Programme"
import { ProgrammeRepository } from "./ProgrammeRepository"

export class PrismaProgrammeRepository implements ProgrammeRepository {
  async creerProgramme(programme: Programme) {
    const programmeModel = convertirEnModel(programme)
    await prisma.programme.create({ data: programmeModel })
  }

  async recupererParId(id: string): Promise<Programme | null> {
    const programmeModel = await prisma.programme.findUnique({ where: { id } })
    return programmeModel ? convertirEnProgramme(programmeModel) : null
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
