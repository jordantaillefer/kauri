import type { Exercice as ExerciceModel } from "@prisma/client"

import { prisma } from "../../../db/prisma"
import type { CATEGORIE } from "../../../exercice/domain/categorie"
import { Exercice } from "../../domain/Exercice"
import { ExerciceNotFoundError } from "../../domain/errors/ExerciceNotFoundError"
import type { SeanceExerciceRepository } from "../../domain/ports/SeanceExerciceRepository"
import { UUID } from "node:crypto"
import { CorrelationIdService } from "@/api/CorrelationIdService"

export class PrismaSeanceExerciceRepository implements SeanceExerciceRepository {
  private readonly correlationId: UUID
  constructor({ correlationIdService }: { correlationIdService: CorrelationIdService }) {
    this.correlationId = correlationIdService.correlationId
  }

  async recupererParId(idExercice: string): Promise<Exercice> {
    const exerciceModel = await prisma.exercice.findUnique({
      where: { id: idExercice }
    })
    if (exerciceModel === null) {
      throw new ExerciceNotFoundError()
    }
    return convertirEnExercice(exerciceModel)
  }

  async creerExercice(exercice: Exercice): Promise<void> {
    const exerciceModel = convertirEnModel(exercice)
    await prisma.exercice.create({
      data: {
        ...exerciceModel,
        correlationId: this.correlationId
      }
    })
  }
}

function convertirEnModel(exercice: Exercice): Omit<ExerciceModel, 'correlationId'> {
  return {
    id: exercice.id,
    nomExercice: exercice.nomExercice,
    categorie: exercice.categorie
  }
}

function convertirEnExercice(exerciceModel: ExerciceModel): Exercice {
  return Exercice.creerExercice({
    id: exerciceModel.id,
    nomExercice: exerciceModel.nomExercice,
    categorie: exerciceModel.categorie as CATEGORIE
  })
}
