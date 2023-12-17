
import { randomUUID } from "crypto";

import type { CATEGORIE } from "./categorie"

export type IdExercice = string
export type NomExercice = string
export type CategorieExercice = CATEGORIE

export class Exercice {
  private readonly _id: IdExercice
  private readonly _nomExercice: NomExercice
  private readonly _categorie: CategorieExercice

  private constructor({
                        id,
                        nomExercice,
                        categorie
                      }: { id: IdExercice, nomExercice: NomExercice, categorie: CategorieExercice }) {
    this._id = id
    this._nomExercice = nomExercice
    this._categorie = categorie
  }

  get id() {
    return this._id
  }

  get nomExercice() {
    return this._nomExercice
  }

  get categorie() {
    return this._categorie
  }

  static creerExercice({
                         id,
                         nomExercice,
                         categorie
                       }: { id?: IdExercice, nomExercice: NomExercice, categorie: CategorieExercice }) {
    return new Exercice({ id: id || randomUUID(), nomExercice, categorie })
  }
}