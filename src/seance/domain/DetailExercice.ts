import { v4 as uuid } from "uuid"

import { CATEGORIE } from "../../exercice/domain/categorie"
import { DetailSerie } from "./DetailSerie"

export class DetailExercice {
  private readonly _id: string
  private readonly _nomExercice: string
  private readonly _listeDetailSerie: DetailSerie[]
  private readonly _categorie: CATEGORIE

  constructor({
                id,
                nomExercice,
                categorie,
                listeDetailSerie
              }: { id: string, nomExercice: string, categorie: CATEGORIE, listeDetailSerie: DetailSerie[] }) {
    this._id = id
    this._nomExercice = nomExercice
    this._categorie = categorie
    this._listeDetailSerie = listeDetailSerie
  }

  get id() {
    return this._id
  }

  get nomExercice() {
    return this._nomExercice
  }

  get listeDetailSerie(): DetailSerie[] {
    return this._listeDetailSerie
  }

  get categorie(): CATEGORIE {
    return this._categorie
  }

  static creerDetailExercice({
                               id,
                               nomExercice,
                               categorie,
                               listeDetailSerie
                             }: { id?: string, nomExercice: string, categorie: CATEGORIE, listeDetailSerie: DetailSerie[] }) {
    return new DetailExercice({ id: id || uuid(), nomExercice, categorie, listeDetailSerie })
  }
}
