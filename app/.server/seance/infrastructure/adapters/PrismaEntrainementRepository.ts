import type {
  Entrainement as EntrainementModel,
  ExerciceEntrainement as ExerciceEntrainementModel,
  SerieEntrainement as SerieEntrainementModel
} from "@prisma/client"

import type { Entrainement } from "../../domain/Entrainement"
import { ExerciceEntrainement } from "../../domain/ExerciceEntrainement"
import { SerieEntrainement } from "../../domain/SerieEntrainement"
import { EntrainementNotFoundError } from "../../domain/errors/EntrainementNotFoundError"
import type { EntrainementRepository } from "../../domain/ports/EntrainementRepository"
import { prisma } from "~/.server/db/prisma"
import type { CATEGORIE } from "~/.server/exercice/domain/categorie"
import { UUID } from "node:crypto"
import { CorrelationIdService } from "@/api/CorrelationIdService"
export class PrismaEntrainementRepository implements EntrainementRepository {
  private readonly correlationId: UUID
  constructor({ correlationIdService }: { correlationIdService: CorrelationIdService }) {
    this.correlationId = correlationIdService.correlationId
  }

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
        correlationId: this.correlationId,
        exerciceEntrainements: {
          create: entrainement.listeExerciceEntrainement.map(exerciceEntrainement => ({
            ...convertirExerciceEntrainementEnModel(exerciceEntrainement),
            correlationId: this.correlationId,
            serieEntrainements: {
              create: exerciceEntrainement.listeSerieEntrainement.map(serieEntrainement => ({
                ...convertirSerieEntrainementEnModel(serieEntrainement),
                correlationId: this.correlationId,
              }))
            }
          }))
        }
      }
    })
  }
}


function convertirEnModel(entrainement: Entrainement): Omit<EntrainementModel, 'correlationId'> {
  return {
    id: entrainement.id,
    idUtilisateur: entrainement.idUtilisateur,
    nomSeance: entrainement.nomSeance
  }
}

function convertirExerciceEntrainementEnModel(
  exerciceEntrainement: ExerciceEntrainement
): Omit<ExerciceEntrainementModel, "idEntrainement" | 'correlationId'> {
  return {
    id: exerciceEntrainement.id,
    nomExercice: exerciceEntrainement.nomExercice,
    categorie: exerciceEntrainement.categorie,
    ordre: exerciceEntrainement.ordre,
    estRealise: exerciceEntrainement.estRealise
  }
}

function convertirSerieEntrainementEnModel(
  serieEntrainement: SerieEntrainement
): Omit<SerieEntrainementModel, "idExerciceEntrainement" | 'correlationId'> {
  return {
    id: serieEntrainement.id,
    nombreRepetition: serieEntrainement.nombreRepetition,
    poids: serieEntrainement.poids,
    tempsRepos: serieEntrainement.tempsRepos,
    ordre: serieEntrainement.ordre,
    estRealise: serieEntrainement.estRealise
  }
}

function convertirEnExerciceEntrainement(
  exerciceEntrainementModel: ExerciceEntrainementModel & { serieEntrainements: SerieEntrainementModel[] }
): ExerciceEntrainement {
  return ExerciceEntrainement.creerExerciceEntrainement({
    id: exerciceEntrainementModel.id,
    nomExercice: exerciceEntrainementModel.nomExercice,
    categorie: exerciceEntrainementModel.categorie as CATEGORIE,
    estRealise: exerciceEntrainementModel.estRealise,
    ordre: exerciceEntrainementModel.ordre,
    listeSerieEntrainement: exerciceEntrainementModel.serieEntrainements.map(convertirEnSerieEntrainement)
  })
}

function convertirEnSerieEntrainement(serieEntrainementModel: SerieEntrainementModel): SerieEntrainement {
  return SerieEntrainement.creerSerieEntrainement({
    id: serieEntrainementModel.id,
    nombreRepetition: serieEntrainementModel.nombreRepetition,
    poids: serieEntrainementModel.poids,
    tempsRepos: serieEntrainementModel.tempsRepos,
    ordre: serieEntrainementModel.ordre,
    estRealise: serieEntrainementModel.estRealise
  })
}
