import { v4 as uuid } from "uuid"
import { DetailExercice } from "./DetailExercice"

export class DetailSeance {
  private readonly _id: string
  private readonly _nomSeance: string
  private readonly _listeDetailExercice: DetailExercice[]

  private constructor({
                        id,
                        nomSeance,
                        listeDetailExercice
                      }: { id: string, nomSeance: string, listeDetailExercice: DetailExercice[] }) {
    this._id = id
    this._nomSeance = nomSeance
    this._listeDetailExercice = listeDetailExercice
  }

  get id() {
    return this._id
  }

  get nomSeance() {
    return this._nomSeance
  }

  get listeDetailExercice() {
    return this._listeDetailExercice
  }

  static creerDetailSeance({
                             id,
                             nomSeance,
                             listeDetailExercice
                           }: { id?: string, nomSeance: string, listeDetailExercice: DetailExercice[] }) {
    return new DetailSeance({
      id: id || uuid(),
      nomSeance,
      listeDetailExercice
    })
  }
}
