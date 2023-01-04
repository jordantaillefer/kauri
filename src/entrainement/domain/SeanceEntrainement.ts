import { v4 as uuid } from "uuid"

export class SeanceEntrainement {
  private readonly _id: string

  private constructor(id: string) {
    this._id = id
  }

  get id(): string {
    return this._id
  }

  static creerSeanceEntrainement({ id }: { id?: string } = {}) {
    return new SeanceEntrainement(id || uuid())
  }
}