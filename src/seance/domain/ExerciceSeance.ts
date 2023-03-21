import { v4 as uuid } from "uuid"

import { CATEGORIE } from "../../exercice/domain/categorie"
import { SerieExerciceSeance } from "./SerieExerciceSeance"

export class ExerciceSeance {
  private readonly _id: string
  private readonly _idSeance: string
  private readonly _idExercice: string
  private readonly _nomExercice: string
  private readonly _categorie: CATEGORIE
  private readonly _ordre: number
  private _listeSerieExerciceSeance: SerieExerciceSeance[]

  private constructor({
                        id,
                        idSeance,
                        idExercice,
                        nomExercice,
                        categorie,
                        ordre,
                        listeSerieExerciceSeance
                      }: { id: string, idSeance: string, idExercice: string, nomExercice: string, categorie: CATEGORIE, ordre: number, listeSerieExerciceSeance: SerieExerciceSeance[] }) {
    this._id = id
    this._idSeance = idSeance
    this._idExercice = idExercice
    this._nomExercice = nomExercice
    this._categorie = categorie
    this._ordre = ordre
    this._listeSerieExerciceSeance = listeSerieExerciceSeance
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

  get listeSerieExerciceSeance(): SerieExerciceSeance[] {
    return this._listeSerieExerciceSeance
  }

  get ordre(): number {
    return this._ordre
  }

  definirSerie(listeSerieExerciceSeance: SerieExerciceSeance[]) {
    this._listeSerieExerciceSeance = listeSerieExerciceSeance
  }

  static creerExerciceSeance({
                               id,
                               idSeance,
                               idExercice,
                               nomExercice,
                               categorie,
                               ordre,
                               listeSerieExerciceSeance
                             }: { id?: string, idSeance: string, idExercice: string, nomExercice: string, categorie: CATEGORIE, ordre: number, listeSerieExerciceSeance?: SerieExerciceSeance[] }) {
    return new ExerciceSeance({
      id: id || uuid(),
      idSeance,
      idExercice,
      nomExercice,
      categorie,
      ordre,
      listeSerieExerciceSeance: listeSerieExerciceSeance || []
    })
  }
}
