import { v4 as uuid } from "uuid"

export class SerieEntrainement {
  private readonly _id: string
  private readonly _nombreRepetition: number
  private readonly _estRealise: boolean

  constructor({ id, nombreRepetition, estRealise }: { id: string, nombreRepetition: number, estRealise: boolean }) {
    this._id = id
    this._nombreRepetition = nombreRepetition
    this._estRealise = estRealise
  }

  get id(): string {
    return this._id
  }

  get nombreRepetition(): number {
    return this._nombreRepetition
  }

  get estRealise(): boolean {
    return this._estRealise
  }

  static creerSerieEntrainement({
                                  id,
                                  nombreRepetition,
                                  estRealise
                                }: { id?: string, nombreRepetition: number, estRealise: boolean }) {
    return new SerieEntrainement({ id: id || uuid(), nombreRepetition, estRealise })
  }
}
