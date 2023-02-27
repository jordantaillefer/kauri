import { v4 as uuid } from "uuid"

type SeanceId = string
type IdUtilisateur = string
type NomSeance = string

export class Seance {
  _id: SeanceId
  _idUtilisateur: IdUtilisateur
  _nomSeance: NomSeance

  private constructor({
                        id,
                        idUtilisateur,
                        nomSeance
                      }: { id: SeanceId, idUtilisateur: IdUtilisateur, nomSeance: NomSeance }) {
    this._id = id
    this._idUtilisateur = idUtilisateur
    this._nomSeance = nomSeance
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

  static creerSeance({ id, idUtilisateur, nomSeance }: { id?: SeanceId, idUtilisateur: IdUtilisateur, nomSeance: NomSeance }) {
    return new Seance({ id: id || uuid(), idUtilisateur, nomSeance })
  }
}