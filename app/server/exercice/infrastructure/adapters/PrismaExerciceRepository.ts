import type { Exercice as ExerciceModel } from "@prisma/client"

import type { Exercice } from "../../domain/Exercice"
import type { ExerciceRepository } from "../../domain/ports/ExerciceRepository"
import { prisma } from "~/server/db/prisma"

function convertirEnModel(exercice: Exercice): ExerciceModel {
  return {
    id: exercice.id,
    nomExercice: exercice.nomExercice,
    categorie: exercice.categorie
  }
}

export class PrismaExerciceRepository implements ExerciceRepository {
  async creerExercice(exercice: Exercice): Promise<void> {
    const exerciceModel = convertirEnModel(exercice)
    await prisma.exercice.create({
      data: {
        id: exerciceModel.id,
        nomExercice: exerciceModel.nomExercice,
        categorie: exerciceModel.categorie
      }
    })
  }
}
