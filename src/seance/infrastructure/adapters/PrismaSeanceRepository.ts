import { ExerciceSeance as ExerciceSeanceModel, Seance as SeanceModel } from "@prisma/client"

import { prisma } from "../../../db/prisma"
import { CATEGORIE } from "../../../exercice/domain/categorie"
import { ExerciceSeance } from "../../domain/ExerciceSeance"
import { IdUtilisateur, Seance } from "../../domain/Seance"
import { SeanceNotFoundError } from "../../domain/errors/SeanceNotFoundError"
import { SeanceRepository } from "../../domain/ports/SeanceRepository"

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
    categorie: exerciceSeanceModel.categorie as CATEGORIE
  })
}

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
      include: { exerciceSeances: true }
    })
    if (seanceModel === null) {
      throw new SeanceNotFoundError()
    }
    return convertirEnSeance(seanceModel)
  }

  async recupererTout(idUtilisateur: IdUtilisateur): Promise<Seance[]> {
    const listeDeProgrammesModels = await prisma.seance.findMany({
      where: { idUtilisateur },
      include: { exerciceSeances: true }
    })
    return listeDeProgrammesModels.map(convertirEnSeance)
  }
}