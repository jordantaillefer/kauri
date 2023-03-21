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

function convertirExerciceEntrainementEnModel(exerciceEntrainement: ExerciceEntrainement): Omit<ExerciceEntrainementModel, "idEntrainement"> {
  return {
    id: exerciceEntrainement.id,
    nomExercice: exerciceEntrainement.nomExercice,
    categorie: exerciceEntrainement.categorie,
    tempsRepos: exerciceEntrainement.tempsRepos,
    estRealise: exerciceEntrainement.estRealise
  }
}

function convertirSerieEntrainementEnModel(serieEntrainement: SerieEntrainement): Omit<SerieEntrainementModel, "idExerciceEntrainement"> {
  return {
    id: serieEntrainement.id,
    nombreRepetition: serieEntrainement.nombreRepetition,
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
function convertirEnDetailEntrainement(entrainementModel: EntrainementModel & { exerciceEntrainements: (ExerciceEntrainementModel & { serieEntrainements: SerieEntrainementModel [] })[] }): Entrainement {
  return Entrainement.creerEntrainement({
    id: entrainementModel.id,
    nomSeance: entrainementModel.nomSeance,
    listeExerciceEntrainement: entrainementModel.exerciceEntrainements.map(convertirEnExerciceEntrainement)
  })
}

function convertirEnExerciceEntrainement(exerciceEntrainementModel: ExerciceEntrainementModel & { serieEntrainements: SerieEntrainementModel [] }): ExerciceEntrainement {
  return ExerciceEntrainement.creerExerciceEntrainement({
    id: exerciceEntrainementModel.id,
    nomExercice: exerciceEntrainementModel.nomExercice,
    categorie: exerciceEntrainementModel.categorie as CATEGORIE,
    tempsRepos: exerciceEntrainementModel.tempsRepos,
    estRealise: exerciceEntrainementModel.estRealise,
    listeSerieEntrainement: exerciceEntrainementModel.serieEntrainements.map(convertirEnSerieEntrainement)
  })
}

function convertirEnSerieEntrainement(serieEntrainementModel: SerieEntrainementModel): SerieEntrainement {
  return SerieEntrainement.creerSerieEntrainement({
    id: serieEntrainementModel.id,
    nombreRepetition: serieEntrainementModel.nombreRepetition,
    estRealise: serieEntrainementModel.estRealise
  })
}

export class PrismaEntrainementRepository implements EntrainementRepository {

  async recupererTout(idUtilisateur: string): Promise<Entrainement[]> {
    const listeDEntrainementModels = await prisma.entrainement.findMany()
    return listeDEntrainementModels.map(convertirEnEntrainement)
  }

  async mettreAJourEntrainementEstRealise(idEntrainement: string, estRealise: boolean): Promise<void> {
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
          include: {
            serieEntrainements: true
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
