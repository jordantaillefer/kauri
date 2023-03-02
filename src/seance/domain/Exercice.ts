import { CATEGORIE } from "../../exercice/domain/categorie"

export class Exercice {
  private _id: string
  private _nomExercice: string
  private _categorie: CATEGORIE

  private constructor({ id, nomExercice, categorie }: { id: string, nomExercice: string, categorie: CATEGORIE }) {
    this._id = id
    this._nomExercice = nomExercice
    this._categorie = categorie
  }

  get id(): string {
    return this._id
  }

  get nomExercice(): string {
    return this._nomExercice
  }

  get categorie(): CATEGORIE {
    return this._categorie
  }

  static creerExercice({ id, nomExercice, categorie }: { id: string, nomExercice: string, categorie: CATEGORIE }) {
    return new Exercice({ id, nomExercice, categorie })
  }
}