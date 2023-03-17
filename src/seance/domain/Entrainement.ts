import { v4 as uuid } from "uuid"

import { ExerciceEntrainement } from "./ExerciceEntrainement"

export class Entrainement {
  private readonly _id: string
  private readonly _nomSeance: string
  private readonly _listeExerciceEntrainement: ExerciceEntrainement[]

  private constructor({ id, nomSeance, listeExerciceEntrainement }: {
    id: string, nomSeance: string, listeExerciceEntrainement: ExerciceEntrainement[]
  }) {
    this._id = id
    this._nomSeance = nomSeance
    this._listeExerciceEntrainement = listeExerciceEntrainement
  }

  get id(): string {
    return this._id
  }

  get nomSeance(): string {
    return this._nomSeance
  }

  get listeExerciceEntrainement(): ExerciceEntrainement[] {
    return this._listeExerciceEntrainement
  }

  static creerEntrainement({
                             id,
                             nomSeance,
                             listeExerciceEntrainement
                           }: {
    id?: string,
    nomSeance: string,
    listeExerciceEntrainement: ExerciceEntrainement[]
  }) {
    return new Entrainement({
      id: id || uuid(),
      nomSeance,
      listeExerciceEntrainement
    })
  }
}
