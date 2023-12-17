import { randomUUID } from "crypto"

import type { SerieEntrainement } from "./SerieEntrainement"
import type { CATEGORIE } from "~/.server/exercice/domain/categorie"

export class ExerciceEntrainement {
  private readonly _id: string
  private _estRealise: boolean
  private readonly _nomExercice: string
  private readonly _categorie: CATEGORIE
  private readonly _listeSerieEntrainement: SerieEntrainement[]
  private readonly _ordre: number

  private constructor({
    id,
    estRealise,
    nomExercice,
    categorie,
    ordre,
    listeSerieEntrainement
  }: {
    id: string
    estRealise: boolean
    nomExercice: string
    categorie: CATEGORIE
    ordre: number
    listeSerieEntrainement: SerieEntrainement[]
  }) {
    this._id = id
    this._estRealise = estRealise
    this._nomExercice = nomExercice
    this._categorie = categorie
    this._ordre = ordre
    this._listeSerieEntrainement = listeSerieEntrainement
  }

  get id(): string {
    return this._id
  }

  get estRealise(): boolean {
    return this._estRealise
  }

  get nomExercice(): string {
    return this._nomExercice
  }

  get categorie(): CATEGORIE {
    return this._categorie
  }

  get ordre(): number {
    return this._ordre
  }

  get listeSerieEntrainement(): SerieEntrainement[] {
    return this._listeSerieEntrainement
  }

  mettreAJourSerieEstRealise(idSerie: string, estRealiseSerie: boolean) {
    // TODO : Mutation interne ? Voir si c'est bien de fork plutot
    this._listeSerieEntrainement.find(serie => serie.id === idSerie)?.mettreAJourEstRealise(estRealiseSerie)
  }

  mettreAJourEstRealise() {
    const estSerieToutesRealisees = this._listeSerieEntrainement.find(serie => !serie.estRealise)
    if (!estSerieToutesRealisees) {
      this._estRealise = true
    }
  }

  static creerExerciceEntrainement({
    id,
    estRealise,
    nomExercice,
    categorie,
    ordre,
    listeSerieEntrainement
  }: {
    id?: string
    estRealise: boolean
    nomExercice: string
    categorie: CATEGORIE
    ordre: number
    listeSerieEntrainement: SerieEntrainement[]
  }) {
    return new ExerciceEntrainement({
      id: id || randomUUID(),
      estRealise,
      nomExercice,
      categorie,
      ordre,
      listeSerieEntrainement
    })
  }
}
