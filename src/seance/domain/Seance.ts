import { v4 as uuid } from "uuid"

import { ExerciceSeance } from "./ExerciceSeance"

export type IdSeance = string
export type IdUtilisateur = string
export type NomSeance = string

export class Seance {
  _id: IdSeance
  _idUtilisateur: IdUtilisateur
  _nomSeance: NomSeance
  private _exerciceSeances: ExerciceSeance[]

  private constructor({
                        id,
                        idUtilisateur,
                        nomSeance,
                        exerciceSeances
                      }: { id: IdSeance, idUtilisateur: IdUtilisateur, nomSeance: NomSeance, exerciceSeances: ExerciceSeance[] }) {
    this._id = id
    this._idUtilisateur = idUtilisateur
    this._nomSeance = nomSeance
    this._exerciceSeances = exerciceSeances
  }

  get id() {
    return this._id
  }

  get idUtilisateur() {
    return this._idUtilisateur
  }

  get nomSeance() {
    return this._nomSeance
  }

  get exerciceSeances(): ExerciceSeance[] {
    return this._exerciceSeances
  }

  static creerSeance({
                       id,
                       idUtilisateur,
                       nomSeance,
                       exerciceSeances
                     }: { id?: IdSeance, idUtilisateur: IdUtilisateur, nomSeance: NomSeance, exerciceSeances: ExerciceSeance[] }) {
    return new Seance({ id: id || uuid(), idUtilisateur, nomSeance, exerciceSeances })
  }
}