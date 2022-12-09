import { v4 as uuid } from "uuid"

import { format } from "../../app/DateFormatter"
import { SeanceEntrainement } from "../../entrainement/domain/SeanceEntrainement"

export class SeanceEntrainementBuilder {
  private _id: string = uuid()
  private _dateSeance: string

  constructor() {
    this._dateSeance = format(new Date())
  }

  withId(id: string): SeanceEntrainementBuilder {
    this._id = id
    return this
  }

  withDateSeance(date: string): SeanceEntrainementBuilder {
    this._dateSeance = date
    return this
  }

  build(): SeanceEntrainement {
    return SeanceEntrainement.creerSeanceEntrainement({ id: this._id, dateSeance: new Date(this._dateSeance) })
  }
}