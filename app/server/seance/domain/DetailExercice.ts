import { randomUUID } from "crypto";

import type { DetailSerie } from "./DetailSerie"
import type { CATEGORIE } from "~/server/exercice/domain/categorie"

export class DetailExercice {
  private readonly _id: string
  private readonly _nomExercice: string
  private readonly _categorie: CATEGORIE
  private readonly _ordre: number
  private readonly _listeDetailSerie: DetailSerie[]
  private readonly _tempsRepos: number

  constructor({
    id,
    nomExercice,
    categorie,
    ordre,
    tempsRepos,
    listeDetailSerie
  }: {
    id: string
    nomExercice: string
    categorie: CATEGORIE
    ordre: number
    tempsRepos: number
    listeDetailSerie: DetailSerie[]
  }) {
    this._id = id
    this._nomExercice = nomExercice
    this._categorie = categorie
    this._ordre = ordre
    this._tempsRepos = tempsRepos
    this._listeDetailSerie = listeDetailSerie
  }

  get id() {
    return this._id
  }

  get nomExercice() {
    return this._nomExercice
  }

  get categorie(): CATEGORIE {
    return this._categorie
  }

  get ordre(): number {
    return this._ordre
  }

  get tempsRepos(): number {
    return this._tempsRepos
  }

  get listeDetailSerie(): DetailSerie[] {
    return this._listeDetailSerie
  }

  static creerDetailExercice({
    id,
    nomExercice,
    categorie,
    ordre,
    tempsRepos,
    listeDetailSerie
  }: {
    id?: string
    nomExercice: string
    categorie: CATEGORIE
    ordre: number
    tempsRepos: number
    listeDetailSerie: DetailSerie[]
  }) {
    return new DetailExercice({ id: id || randomUUID(), nomExercice, categorie, ordre, tempsRepos, listeDetailSerie })
  }
}
