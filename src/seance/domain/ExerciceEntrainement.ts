import { v4 as uuid } from "uuid"

import { CATEGORIE } from "../../exercice/domain/categorie"
import { SerieEntrainement } from "./SerieEntrainement"

export class ExerciceEntrainement {
  private readonly _id: string
  private readonly _estRealise: boolean
  private readonly _tempsRepos: number
  private readonly _nomExercice: string
  private readonly _categorie: CATEGORIE
  private readonly _listeSerieEntrainement: SerieEntrainement[]

  private constructor({
                id,
                estRealise,
                tempsRepos,
                nomExercice,
                categorie,
                listeSerieEntrainement
              }: { id: string, estRealise: boolean, tempsRepos: number, nomExercice: string, categorie: CATEGORIE, listeSerieEntrainement: SerieEntrainement[] }) {
    this._id = id
    this._estRealise = estRealise
    this._tempsRepos = tempsRepos
    this._nomExercice = nomExercice
    this._categorie = categorie
    this._listeSerieEntrainement = listeSerieEntrainement
  }

  get id(): string {
    return this._id
  }

  get estRealise(): boolean {
    return this._estRealise
  }

  get tempsRepos(): number {
    return this._tempsRepos
  }

  get nomExercice(): string {
    return this._nomExercice
  }

  get categorie(): CATEGORIE {
    return this._categorie
  }

  get listeSerieEntrainement(): SerieEntrainement[] {
    return this._listeSerieEntrainement
  }

  static creerExerciceEntrainement({
                                     id,
                                     estRealise,
                                     tempsRepos,
                                     nomExercice,
                                     categorie,
                                     listeSerieEntrainement
                                   }: { id?: string, estRealise: boolean, tempsRepos: number, nomExercice: string, categorie: CATEGORIE, listeSerieEntrainement: SerieEntrainement[] }) {
    return new ExerciceEntrainement({
      id: id || uuid(),
      estRealise,
      tempsRepos,
      nomExercice,
      categorie,
      listeSerieEntrainement
    })
  }
}
