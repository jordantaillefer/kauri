import { Exercice as ExerciceModel } from "@prisma/client"

import { Exercice } from "../../domain/Exercice"
import { ExerciceRepository } from "../../domain/ports/ExerciceRepository"
import { prisma } from "api/db/prisma"

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