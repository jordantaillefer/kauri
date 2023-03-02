import { v4 as uuid } from "uuid"

import { CATEGORIE } from "../../exercice/domain/categorie"

export class ExerciceSeance {
  _id: string
  _idSeance: string
  _idExercice: string
  _nomExercice: string
  _categorie: CATEGORIE

  private constructor({
                        id,
                        idSeance,
                        idExercice,
                        nomExercice,
                        categorie
                      }: { id: string, idSeance: string, idExercice: string, nomExercice: string, categorie: CATEGORIE }) {
    this._id = id
    this._idSeance = idSeance
    this._idExercice = idExercice
    this._nomExercice = nomExercice
    this._categorie = categorie
  }

  get id(): string {
    return this._id
  }

  get idSeance(): string {
    return this._idSeance
  }

  get idExercice(): string {
    return this._idExercice
  }

  get nomExercice(): string {
    return this._nomExercice
  }

  get categorie(): CATEGORIE {
    return this._categorie
  }

  static creerExerciceSeance({
                               id,
                               idSeance,
                               idExercice,
                               nomExercice,
                               categorie
                             }: { id?: string, idSeance: string, idExercice: string, nomExercice: string, categorie: CATEGORIE }) {
    return new ExerciceSeance({ id: id || uuid(), idSeance, idExercice, nomExercice, categorie })
  }

}