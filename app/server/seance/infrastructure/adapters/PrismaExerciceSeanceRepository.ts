import type { ExerciceSeance as ExerciceSeanceModel, SerieExerciceSeance as SerieExerciceSeanceModel } from "@prisma/client"

import { prisma } from "../../../db/prisma"
import type { CATEGORIE } from "../../../exercice/domain/categorie"
import { ExerciceSeance } from "../../domain/ExerciceSeance"
import { SerieExerciceSeance } from "../../domain/SerieExerciceSeance"
import { ExerciceSeanceNotFoundError } from "../../domain/errors/ExerciceSeanceNotFoundError"
import type { ExerciceSeanceRepository } from "../../domain/ports/ExerciceSeanceRepository"

function convertirSerieExerciceSeanceEnModel(serieExerciceSeance: SerieExerciceSeance): Omit<SerieExerciceSeanceModel, "idExerciceSeance"> {
  return {
    id: serieExerciceSeance.id,
    repetitions: serieExerciceSeance.repetitions,
    ordre: serieExerciceSeance.ordre
  }
}

function convertirEnModel(exerciceSeance: ExerciceSeance): ExerciceSeanceModel {
  return {
    id: exerciceSeance.id,
    idSeance: exerciceSeance.idSeance,
    idExercice: exerciceSeance.idExercice,
    nomExercice: exerciceSeance.nomExercice,
    categorie: exerciceSeance.categorie,
    ordre: exerciceSeance.ordre,
    tempsRepos: exerciceSeance.tempsRepos
  }
}

const convertirEnSerieExerciceSeance = (serieExerciceSeanceModel: SerieExerciceSeanceModel): SerieExerciceSeance => {
  return SerieExerciceSeance.creerSerieExerciceSeance({
    id: serieExerciceSeanceModel.id,
    repetitions: serieExerciceSeanceModel.repetitions,
    ordre: serieExerciceSeanceModel.ordre
  })
}

function convertirEnExerciceSeance(exerciceSeanceModel: ExerciceSeanceModel & { serieExerciceSeances: SerieExerciceSeanceModel[] }): ExerciceSeance {
  return ExerciceSeance.creerExerciceSeance({
    id: exerciceSeanceModel.id,
    idSeance: exerciceSeanceModel.idSeance,
    idExercice: exerciceSeanceModel.idExercice,
    nomExercice: exerciceSeanceModel.nomExercice,
    categorie: exerciceSeanceModel.categorie as CATEGORIE,
    ordre: exerciceSeanceModel.ordre,
    tempsRepos: exerciceSeanceModel.tempsRepos,
    listeSerieExerciceSeance: exerciceSeanceModel.serieExerciceSeances.map(convertirEnSerieExerciceSeance)
  })
}

export class PrismaExerciceSeanceRepository implements ExerciceSeanceRepository {
  async mettreAJourTempsRepos(idExerciceSeance: string, tempsRepos: number): Promise<void> {
    await prisma.exerciceSeance.update({
      where: { id: idExerciceSeance },
      data: {
        tempsRepos
      }
    })
  }
  async creerExerciceSeance(exerciceSeance: ExerciceSeance): Promise<void> {
    const exerciceModel = convertirEnModel(exerciceSeance)
    await prisma.exerciceSeance.create({
      data: {
        ...exerciceModel,
        serieExerciceSeances: {
          create: exerciceSeance.listeSerieExerciceSeance.map(convertirSerieExerciceSeanceEnModel)
        }
      },
    })
  }

  async recupererTout(): Promise<ExerciceSeance[]> {
    const listeExerciceSeanceModels = await prisma.exerciceSeance.findMany({
      include: { serieExerciceSeances: true }
    })
    return listeExerciceSeanceModels.map(convertirEnExerciceSeance)

  }

  async recupererParIdSeanceEtParId(idSeance: string, idExerciceSeance: string): Promise<ExerciceSeance> {
    const exerciceSeanceModel = await prisma.exerciceSeance.findUnique({
      where: { id: idExerciceSeance },
      include: { serieExerciceSeances: true }
    })
    if (exerciceSeanceModel === null || exerciceSeanceModel.idSeance !== idSeance) {
      throw new ExerciceSeanceNotFoundError()
    }
    return convertirEnExerciceSeance(exerciceSeanceModel)
  }

  async ajouterSerieExerciceSeance(exerciceSeance: ExerciceSeance): Promise<void> {
    const serieExerciceSeanceModels = exerciceSeance.listeSerieExerciceSeance.map(convertirSerieExerciceSeanceEnModel)
    await prisma.exerciceSeance.update({
      where: { id: exerciceSeance.id },
      data: {
        serieExerciceSeances: {
          create: serieExerciceSeanceModels
        }
      }
    })
  }

  async supprimerSerieExerciceSeance(idExerciceSeance: string): Promise<void> {
    await prisma.serieExerciceSeance.deleteMany({
      where: { idExerciceSeance }
    })
  }
}