import {
  Entrainement as EntrainementModel,
  ExerciceEntrainement as ExerciceEntrainementModel,
  SerieEntrainement as SerieEntrainementModel
} from "@prisma/client"

import { prisma } from "../../../db/prisma"
import { CATEGORIE } from "../../../exercice/domain/categorie"
import { Entrainement } from "../../domain/Entrainement"
import { ExerciceEntrainement } from "../../domain/ExerciceEntrainement"
import { SerieEntrainement } from "../../domain/SerieEntrainement"
import { EntrainementNotFoundError } from "../../domain/errors/EntrainementNotFoundError"
import { EntrainementRepository } from "../../domain/ports/EntrainementRepository"

function convertirEnModel(entrainement: Entrainement): EntrainementModel {
  return {
    id: entrainement.id,
    nomSeance: entrainement.nomSeance
  }
}

function convertirExerciceEntrainementEnModel(
  exerciceEntrainement: ExerciceEntrainement
): Omit<ExerciceEntrainementModel, "idEntrainement"> {
  return {
    id: exerciceEntrainement.id,
    nomExercice: exerciceEntrainement.nomExercice,
    categorie: exerciceEntrainement.categorie,
    tempsRepos: exerciceEntrainement.tempsRepos,
    ordre: exerciceEntrainement.ordre,
    estRealise: exerciceEntrainement.estRealise
  }
}

function convertirSerieEntrainementEnModel(
  serieEntrainement: SerieEntrainement
): Omit<SerieEntrainementModel, "idExerciceEntrainement"> {
  return {
    id: serieEntrainement.id,
    nombreRepetition: serieEntrainement.nombreRepetition,
    ordre: serieEntrainement.ordre,
    estRealise: serieEntrainement.estRealise
  }
}

function convertirEnEntrainement(entrainementModel: EntrainementModel): Entrainement {
  return Entrainement.creerEntrainement({
    id: entrainementModel.id,
    nomSeance: entrainementModel.nomSeance,
    listeExerciceEntrainement: []
  })
}

function convertirEnDetailEntrainement(
  entrainementModel: EntrainementModel & {
    exerciceEntrainements: (ExerciceEntrainementModel & { serieEntrainements: SerieEntrainementModel[] })[]
  }
): Entrainement {
  return Entrainement.creerEntrainement({
    id: entrainementModel.id,
    nomSeance: entrainementModel.nomSeance,
    listeExerciceEntrainement: entrainementModel.exerciceEntrainements.map(convertirEnExerciceEntrainement)
  })
}

function convertirEnExerciceEntrainement(
  exerciceEntrainementModel: ExerciceEntrainementModel & { serieEntrainements: SerieEntrainementModel[] }
): ExerciceEntrainement {
  return ExerciceEntrainement.creerExerciceEntrainement({
    id: exerciceEntrainementModel.id,
    nomExercice: exerciceEntrainementModel.nomExercice,
    categorie: exerciceEntrainementModel.categorie as CATEGORIE,
    tempsRepos: exerciceEntrainementModel.tempsRepos,
    estRealise: exerciceEntrainementModel.estRealise,
    ordre: exerciceEntrainementModel.ordre,
    listeSerieEntrainement: exerciceEntrainementModel.serieEntrainements.map(convertirEnSerieEntrainement)
  })
}

function convertirEnSerieEntrainement(serieEntrainementModel: SerieEntrainementModel): SerieEntrainement {
  return SerieEntrainement.creerSerieEntrainement({
    id: serieEntrainementModel.id,
    nombreRepetition: serieEntrainementModel.nombreRepetition,
    ordre: serieEntrainementModel.ordre,
    estRealise: serieEntrainementModel.estRealise
  })
}

export class PrismaEntrainementRepository implements EntrainementRepository {
  async recupererExerciceEntrainementParId(idExercice: string): Promise<ExerciceEntrainement> {
    const exerciceModel = await prisma.exerciceEntrainement.findUnique({
      where: { id: idExercice },
      include: {
        serieEntrainements: {
          orderBy: { ordre: "asc" }
        }
      }
    })
    if (!exerciceModel) {
      throw new EntrainementNotFoundError()
    }
    return convertirEnExerciceEntrainement(exerciceModel)
  }

  async mettreAJourExercice(exerciceEntrainement: ExerciceEntrainement): Promise<void> {
    const updateSerieList = exerciceEntrainement.listeSerieEntrainement.map(this.mettreAJourSerie)
    await Promise.all(updateSerieList)
    const exerciceEntrainementModel = convertirExerciceEntrainementEnModel(exerciceEntrainement)
    await prisma.exerciceEntrainement.update({
      where: { id: exerciceEntrainementModel.id },
      data: exerciceEntrainementModel
    })
  }

  async mettreAJourSerie(serieEntrainement: SerieEntrainement) {
    const serieEntrainementModel = convertirSerieEntrainementEnModel(serieEntrainement)
    await prisma.serieEntrainement.update({
      where: { id: serieEntrainementModel.id },
      data: serieEntrainementModel
    })
  }

  async recupererTout(idUtilisateur: string): Promise<Entrainement[]> {
    const listeDEntrainementModels = await prisma.entrainement.findMany()
    return listeDEntrainementModels.map(convertirEnEntrainement)
  }

  async mettreAJourExerciceEstRealise(idEntrainement: string, estRealise: boolean): Promise<void> {
    await prisma.exerciceEntrainement.update({
      where: { id: idEntrainement },
      data: {
        estRealise
      }
    })
  }

  async mettreAJourSerieEstRealise(idSerie: string, estRealise: boolean): Promise<void> {
    await prisma.serieEntrainement.update({
      where: { id: idSerie },
      data: {
        estRealise
      }
    })
  }

  async creerEntrainement(entrainement: Entrainement): Promise<void> {
    const entrainementModel = convertirEnModel(entrainement)
    await prisma.entrainement.create({
      data: {
        ...entrainementModel,
        exerciceEntrainements: {
          create: entrainement.listeExerciceEntrainement.map(exerciceEntrainement => ({
            ...convertirExerciceEntrainementEnModel(exerciceEntrainement),
            serieEntrainements: {
              create: exerciceEntrainement.listeSerieEntrainement.map(serieEntrainement => ({
                ...convertirSerieEntrainementEnModel(serieEntrainement)
              }))
            }
          }))
        }
      }
    })
  }

  async recupererParId(id: string): Promise<Entrainement> {
    const entrainementModel = await prisma.entrainement.findUnique({
      where: { id },
      include: {
        exerciceEntrainements: {
          orderBy: { ordre: "asc" },
          include: {
            serieEntrainements: { orderBy: { ordre: "asc" } }
          }
        }
      }
    })

    if (!entrainementModel) {
      throw new EntrainementNotFoundError()
    }

    return convertirEnDetailEntrainement(entrainementModel)
  }
}
