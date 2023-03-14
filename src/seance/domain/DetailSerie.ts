import { v4 as uuid } from "uuid"

export class DetailSerie {
  private readonly _id: string
  private readonly _nombreRepetition: number

  constructor({ id, nombreRepetition }: { id: string, nombreRepetition: number }) {
    this._id = id
    this._nombreRepetition = nombreRepetition
  }

  get id(): string {
    return this._id
  }

  get nombreRepetition(): number {
    return this._nombreRepetition
  }

  static creerDetailSerie({ id, nombreRepetition }: { id: string, nombreRepetition: number }) {
    return new DetailSerie({ id: id || uuid(), nombreRepetition })
  }
}
