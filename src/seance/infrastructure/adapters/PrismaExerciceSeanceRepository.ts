import { ExerciceSeance as ExerciceSeanceModel } from "@prisma/client"

import { prisma } from "../../../db/prisma"
import { CATEGORIE } from "../../../exercice/domain/categorie"
import { ExerciceSeance } from "../../domain/ExerciceSeance"
import { ExerciceSeanceNotFoundError } from "../../domain/errors/ExerciceSeanceNotFoundError"
import { ExerciceSeanceRepository } from "../../domain/ports/ExerciceSeanceRepository"

function convertirEnModel(exerciceSeance: ExerciceSeance): ExerciceSeanceModel {
  return {
    id: exerciceSeance.id,
    idSeance: exerciceSeance.idSeance,
    idExercice: exerciceSeance.idExercice,
    nomExercice: exerciceSeance.nomExercice,
    categorie: exerciceSeance.categorie
  }
}

function convertirEnExerciceSeance(exerciceSeanceModel: ExerciceSeanceModel): ExerciceSeance {
  return ExerciceSeance.creerExerciceSeance({
    id: exerciceSeanceModel.id,
    idSeance: exerciceSeanceModel.idSeance,
    idExercice: exerciceSeanceModel.idExercice,
    nomExercice: exerciceSeanceModel.nomExercice,
    categorie: exerciceSeanceModel.categorie as CATEGORIE
  })
}

export class PrismaExerciceSeanceRepository implements ExerciceSeanceRepository {
  async creerExerciceSeance(exerciceSeance: ExerciceSeance): Promise<void> {
    const exerciceModel = convertirEnModel(exerciceSeance)
    await prisma.exerciceSeance.create({
      data: exerciceModel
    })
  }

  async recupererTout(): Promise<ExerciceSeance[]> {
    const listeExerciceSeanceModels = await prisma.exerciceSeance.findMany()
    return listeExerciceSeanceModels.map(convertirEnExerciceSeance)

  }

  async recupererParIdSeanceEtParId(idSeance: string, idExerciceSeance: string): Promise<ExerciceSeance> {
    const exerciceSeanceModel = await prisma.exerciceSeance.findUnique({
      where: { id: idExerciceSeance }
    })
    if (exerciceSeanceModel === null || exerciceSeanceModel.idSeance !== idSeance) {
      throw new ExerciceSeanceNotFoundError()
    }
    return convertirEnExerciceSeance(exerciceSeanceModel)
  }
}