import type {
  ExerciceSeance as ExerciceSeanceModel,
  Seance as SeanceModel,
  SerieExerciceSeance as SerieExerciceSeanceModel
} from "@prisma/client"

import { prisma } from "@/api/db/prisma"
import type { CATEGORIE } from "@/api/exercice/domain/categorie"
import { DetailExercice } from "../../domain/DetailExercice"
import { DetailSeance } from "../../domain/DetailSeance"
import { DetailSerie } from "../../domain/DetailSerie"
import { ExerciceSeance } from "../../domain/ExerciceSeance"
import { Seance } from "../../domain/Seance"
import { SeanceNotFoundError } from "../../domain/errors/SeanceNotFoundError"
import type { SeanceRepository } from "../../domain/ports/SeanceRepository"
import type { SerieExerciceSeance } from "~/server/seance/domain/SerieExerciceSeance"

function convertirEnModel(seance: Seance): SeanceModel {
  return {
    id: seance.id,
    idUtilisateur: seance.idUtilisateur,
    nomSeance: seance.nomSeance
  }
}

function convertirEnSeance(seanceModel: SeanceModel & { exerciceSeances: ExerciceSeanceModel[] }): Seance {
  return Seance.creerSeance({
    id: seanceModel.id,
    idUtilisateur: seanceModel.idUtilisateur,
    nomSeance: seanceModel.nomSeance,
    exerciceSeances: seanceModel.exerciceSeances.map(convertirEnExerciceSeance)
  })
}

function convertirEnExerciceSeance(exerciceSeanceModel: ExerciceSeanceModel): ExerciceSeance {
  return ExerciceSeance.creerExerciceSeance({
    id: exerciceSeanceModel.id,
    idSeance: exerciceSeanceModel.idSeance,
    idExercice: exerciceSeanceModel.idExercice,
    nomExercice: exerciceSeanceModel.nomExercice,
    ordre: exerciceSeanceModel.ordre,
    categorie: exerciceSeanceModel.categorie as CATEGORIE,
    tempsRepos: exerciceSeanceModel.tempsRepos
  })
}

type DetailSeanceModel = SeanceModel & {
  exerciceSeances: (ExerciceSeanceModel & { serieExerciceSeances: SerieExerciceSeanceModel[] })[]
}
type DetailExerciceModel = ExerciceSeanceModel & { serieExerciceSeances: SerieExerciceSeanceModel[] }

function convertirEnDetailSerie(serieExerciceSeanceModel: SerieExerciceSeanceModel): DetailSerie {
  return DetailSerie.creerDetailSerie({
    id: serieExerciceSeanceModel.id,
    nombreRepetition: serieExerciceSeanceModel.repetitions,
    ordre: serieExerciceSeanceModel.ordre
  })
}

function convertirEnDetailExerciceSeance(detailExerciceModel: DetailExerciceModel): DetailExercice {
  return DetailExercice.creerDetailExercice({
    id: detailExerciceModel.id,
    nomExercice: detailExerciceModel.nomExercice,
    categorie: detailExerciceModel.categorie as CATEGORIE,
    ordre: detailExerciceModel.ordre,
    tempsRepos: detailExerciceModel.tempsRepos,
    listeDetailSerie: detailExerciceModel.serieExerciceSeances.map(convertirEnDetailSerie)
  })
}

function convertirEnDetailSeance(detailSeanceModel: DetailSeanceModel): DetailSeance {
  return DetailSeance.creerDetailSeance({
    id: detailSeanceModel.id,
    nomSeance: detailSeanceModel.nomSeance,
    listeDetailExercice: detailSeanceModel.exerciceSeances.map(convertirEnDetailExerciceSeance)
  })
}

function convertirEnExerciceSeanceModel(exerciceSeance: ExerciceSeance): Omit<ExerciceSeanceModel, "idSeance"> {
  return {
    id: exerciceSeance.id,
    idExercice: exerciceSeance.idExercice,
    nomExercice: exerciceSeance.nomExercice,
    categorie: exerciceSeance.categorie,
    ordre: exerciceSeance.ordre,
    tempsRepos: exerciceSeance.tempsRepos
  }
}

const convertirEnSerieModel = (
  serieExerciceSeance: SerieExerciceSeance
): Omit<SerieExerciceSeanceModel, "idExerciceSeance"> => ({
  id: serieExerciceSeance.id,
  ordre: serieExerciceSeance.ordre,
  repetitions: serieExerciceSeance.repetitions
})

export class PrismaSeanceRepository implements SeanceRepository {
  async creerSeance(seance: Seance) {
    const seanceModel = convertirEnModel(seance)
    await prisma.seance.create({
      data: {
        id: seanceModel.id,
        nomSeance: seanceModel.nomSeance,
        idUtilisateur: seanceModel.idUtilisateur
      }
    })
  }

  async recupererParId(idSeance: string): Promise<Seance> {
    const seanceModel = await prisma.seance.findUnique({
      where: { id: idSeance },
      include: {
        exerciceSeances: {
          orderBy: { ordre: "asc" }
        }
      }
    })
    if (seanceModel === null) {
      throw new SeanceNotFoundError()
    }
    return convertirEnSeance(seanceModel)
  }

  async recupererDetailParId(idUtilisateur: string, idSeance: string): Promise<DetailSeance> {
    const detailSeanceModel = await prisma.seance.findUnique({
      where: { id: idSeance },
      include: {
        exerciceSeances: {
          orderBy: { ordre: "asc" },
          include: {
            serieExerciceSeances: { orderBy: { ordre: "asc" } }
          }
        }
      }
    })
    if (detailSeanceModel === null) {
      throw new SeanceNotFoundError()
    }

    return convertirEnDetailSeance(detailSeanceModel)
  }

  async ajouterExerciceSeanceASeance(idSeance: string, exerciceSeanceAAjouter: ExerciceSeance): Promise<void> {
    const exerciceSeanceModel = convertirEnExerciceSeanceModel(exerciceSeanceAAjouter)
    await prisma.seance.update({
      where: { id: idSeance },
      data: {
        exerciceSeances: {
          create: {
            ...exerciceSeanceModel,
            serieExerciceSeances: {
              create: exerciceSeanceAAjouter.listeSerieExerciceSeance.map(convertirEnSerieModel)
            }
          }
        }
      }
    })
  }

  async modifierNomSeance(idSeance: string, nouveauNomSeance: string): Promise<void> {
    await prisma.seance.update({
      where: { id: idSeance },
      data: {
        nomSeance: nouveauNomSeance
      }
    })
  }
}
