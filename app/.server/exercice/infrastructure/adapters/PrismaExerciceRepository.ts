import type { Exercice as ExerciceModel } from "@prisma/client"

import type { Exercice } from "../../domain/Exercice"
import type { ExerciceRepository } from "../../domain/ports/ExerciceRepository"
import { prisma } from "~/.server/db/prisma"
import { UUID } from "node:crypto"
import { CorrelationIdService } from "@/api/CorrelationIdService"

export class PrismaExerciceRepository implements ExerciceRepository {
  private readonly correlationId: UUID
  constructor({ correlationIdService }: { correlationIdService: CorrelationIdService }) {
    this.correlationId = correlationIdService.correlationId
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
