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
import type { SerieExerciceSeance } from "~/.server/seance/domain/SerieExerciceSeance"
import { UUID } from "node:crypto"
import { CorrelationIdService } from "@/api/CorrelationIdService"
export class PrismaSeanceRepository implements SeanceRepository {
  private readonly correlationId: UUID
  constructor({ correlationIdService }: { correlationIdService: CorrelationIdService }) {
    this.correlationId = correlationIdService.correlationId
  }

  async creerSeance(seance: Seance) {
    const seanceModel = convertirEnModel(seance)
    await prisma.seance.create({
      data: {
        ...seanceModel,
        correlationId: this.correlationId
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

  async recupererDetailParId(idSeance: string): Promise<DetailSeance> {
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
            correlationId: this.correlationId,
            serieExerciceSeances: {
              create: exerciceSeanceAAjouter.listeSerieExerciceSeance.map(serieExerciceSeance => ({
                ...convertirEnSerieExerciceSeanceModel(serieExerciceSeance),
                correlationId: this.correlationId
              }))
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


function convertirEnModel(seance: Seance): Omit<SeanceModel, 'correlationId'> {
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
    categorie: exerciceSeanceModel.categorie as CATEGORIE
  })
}

type DetailSeanceModel = SeanceModel & {
  exerciceSeances: (ExerciceSeanceModel & { serieExerciceSeances: SerieExerciceSeanceModel[] })[]
}
type DetailExerciceModel = ExerciceSeanceModel & { serieExerciceSeances: SerieExerciceSeanceModel[] }

function convertirEnDetailSerie(serieExerciceSeanceModel: SerieExerciceSeanceModel): DetailSerie {
  return DetailSerie.creerDetailSerie({
    id: serieExerciceSeanceModel.id,
    poids: serieExerciceSeanceModel.poids,
    nombreRepetition: serieExerciceSeanceModel.repetitions,
    tempsRepos: serieExerciceSeanceModel.tempsRepos,
    ordre: serieExerciceSeanceModel.ordre
  })
}

function convertirEnDetailExerciceSeance(detailExerciceModel: DetailExerciceModel): DetailExercice {
  return DetailExercice.creerDetailExercice({
    id: detailExerciceModel.id,
    idExercice: detailExerciceModel.idExercice,
    nomExercice: detailExerciceModel.nomExercice,
    categorie: detailExerciceModel.categorie as CATEGORIE,
    ordre: detailExerciceModel.ordre,
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

function convertirEnExerciceSeanceModel(exerciceSeance: ExerciceSeance): Omit<ExerciceSeanceModel, "idSeance" | "correlationId"> {
  return {
    id: exerciceSeance.id,
    idExercice: exerciceSeance.idExercice,
    nomExercice: exerciceSeance.nomExercice,
    categorie: exerciceSeance.categorie,
    ordre: exerciceSeance.ordre
  }
}

const convertirEnSerieExerciceSeanceModel = (
  serieExerciceSeance: SerieExerciceSeance
): Omit<SerieExerciceSeanceModel, "idExerciceSeance" | "correlationId"> => ({
  id: serieExerciceSeance.id,
  ordre: serieExerciceSeance.ordre,
  repetitions: serieExerciceSeance.repetitions,
  poids: serieExerciceSeance.poids,
  tempsRepos: serieExerciceSeance.tempsRepos
})
