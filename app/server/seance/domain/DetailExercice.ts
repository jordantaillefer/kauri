import { randomUUID } from "crypto"

import type { DetailSerie } from "./DetailSerie"
import type { CATEGORIE } from "~/server/exercice/domain/categorie"

export class DetailExercice {
  private readonly _id: string
  private readonly _idExercice: string
  private readonly _nomExercice: string
  private readonly _categorie: CATEGORIE
  private readonly _ordre: number
  private readonly _listeDetailSerie: DetailSerie[]

  constructor({
    id,
    idExercice,
    nomExercice,
    categorie,
    ordre,
    listeDetailSerie
  }: {
    id: string
    idExercice: string
    nomExercice: string
    categorie: CATEGORIE
    ordre: number
    listeDetailSerie: DetailSerie[]
  }) {
    this._id = id
    this._idExercice = idExercice
    this._nomExercice = nomExercice
    this._categorie = categorie
    this._ordre = ordre
    this._listeDetailSerie = listeDetailSerie
  }

  get id() {
    return this._id
  }

  get nomExercice() {
    return this._nomExercice
  }

  get idExercice() {
    return this._idExercice
  }

  get categorie(): CATEGORIE {
    return this._categorie
  }

  get ordre(): number {
    return this._ordre
  }

  get listeDetailSerie(): DetailSerie[] {
    return this._listeDetailSerie
  }

  static creerDetailExercice({
    id,
    idExercice,
    nomExercice,
    categorie,
    ordre,
    listeDetailSerie
  }: {
    id?: string
    idExercice: string
    nomExercice: string
    categorie: CATEGORIE
    ordre: number
    listeDetailSerie: DetailSerie[]
  }) {
    return new DetailExercice({ id: id || randomUUID(), idExercice, nomExercice, categorie, ordre, listeDetailSerie })
  }
}
