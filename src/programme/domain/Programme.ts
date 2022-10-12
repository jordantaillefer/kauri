import { v4 as uuid } from "uuid"

export class Programme {
  private readonly _userId: string
  private readonly _nomProgramme: string
  private readonly _id: string

  constructor({ id, userId, nomProgramme }: { id: string, userId: string, nomProgramme: string }) {
    this._id = id
    this._userId = userId
    this._nomProgramme = nomProgramme
  }

  get userId(): string {
    return this._userId
  }

  get nomProgramme(): string {
    return this._nomProgramme
  }

  get id(): string {
    return this._id
  }

  static creerProgramme({ id, userId, nomProgramme }: { id?: string, userId: string, nomProgramme: string }): Programme {
    return new Programme({ id: id || uuid(), userId, nomProgramme })
  }
}