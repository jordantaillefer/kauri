import { Exercice as ExerciceModel } from "@prisma/client"

import { prisma } from "../../../db/prisma"
import { CATEGORIE } from "../../../exercice/domain/categorie"
import { Exercice } from "../../domain/Exercice"
import { ExerciceNotFoundError } from "../../domain/errors/ExerciceNotFoundError"
import { SeanceExerciceRepository } from "../../domain/ports/SeanceExerciceRepository"

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

export class PrismaSeanceExerciceRepository implements SeanceExerciceRepository {
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
        id: exerciceModel.id,
        nomExercice: exerciceModel.nomExercice,
        categorie: exerciceModel.categorie
      }
    })
  }
}