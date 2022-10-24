import { v4 as uuid } from "uuid"

export class Programme {
  private readonly _idUtilisateur: string
  private readonly _nomProgramme: string
  private readonly _id: string

  constructor({ id, idUtilisateur, nomProgramme }: { id: string, idUtilisateur: string, nomProgramme: string }) {
    this._id = id
    this._idUtilisateur = idUtilisateur
    this._nomProgramme = nomProgramme
  }

  get idUtilisateur(): string {
    return this._idUtilisateur
  }

  get nomProgramme(): string {
    return this._nomProgramme
  }

  get id(): string {
    return this._id
  }

  static creerProgramme({ id, idUtilisateur, nomProgramme }: { id?: string, idUtilisateur: string, nomProgramme: string }): Programme {
    return new Programme({ id: id || uuid(), idUtilisateur, nomProgramme })
  }
}