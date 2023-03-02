import { Exercice as ExerciceModel } from "@prisma/client"

import { prisma } from "../../../db/prisma"
import { Exercice } from "../../domain/Exercice"
import { CATEGORIE } from "../../domain/categorie"
import { ExerciceRepository } from "../../domain/ports/ExerciceRepository"

function convertirEnModel(exercice: Exercice): ExerciceModel {
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

  async recupererTout(): Promise<Exercice[]> {
    const listeDExerciceModels = await prisma.exercice.findMany()
    return listeDExerciceModels.map(convertirEnExercice)
  }
}