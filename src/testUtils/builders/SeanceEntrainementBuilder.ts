import { v4 as uuid } from "uuid"

import { format } from "../../app/DateFormatter"
import { SeanceEntrainement } from "../../entrainement/domain/SeanceEntrainement"

export class SeanceEntrainementBuilder {
  private _id: string = uuid()

  withId(id: string): SeanceEntrainementBuilder {
    this._id = id
    return this
  }

  build(): SeanceEntrainement {
    return SeanceEntrainement.creerSeanceEntrainement({ id: this._id })
  }
}