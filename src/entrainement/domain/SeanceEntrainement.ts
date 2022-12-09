import { v4 as uuid } from "uuid"

export class SeanceEntrainement {
  private readonly _id: string
  private readonly _dateSeance: string

  private constructor(id: string, dateSeance: string) {
    this._id = id
    this._dateSeance = dateSeance
  }

  get id(): string {
    return this._id
  }

  get dateSeance(): string {
    return this._dateSeance
  }

  static creerSeanceEntrainement({ id, dateSeance }: { id?: string, dateSeance?: Date } = {}) {
    return new SeanceEntrainement(id || uuid(), dateSeance ? new Date(dateSeance).toISOString() : new Date().toLocaleDateString())
  }
}