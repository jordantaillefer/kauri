import { randomUUID } from "crypto";

export class DetailSerie {
  private readonly _id: string
  private readonly _nombreRepetition: number
  private readonly _ordre: number

  constructor({ id, nombreRepetition, ordre }: { id: string, nombreRepetition: number, ordre: number }) {
    this._id = id
    this._nombreRepetition = nombreRepetition
    this._ordre = ordre
  }

  get id(): string {
    return this._id
  }

  get nombreRepetition(): number {
    return this._nombreRepetition
  }

  get ordre(): number {
    return this._ordre
  }

  static creerDetailSerie({ id, nombreRepetition, ordre }: { id: string, nombreRepetition: number, ordre: number }) {
    return new DetailSerie({ id: id || randomUUID(), nombreRepetition, ordre })
  }
}
