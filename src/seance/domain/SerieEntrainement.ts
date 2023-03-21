import { v4 as uuid } from "uuid"

export class SerieEntrainement {
  private readonly _id: string
  private readonly _nombreRepetition: number
  private readonly _estRealise: boolean
  private readonly _ordre: number

  constructor({ id, nombreRepetition, ordre, estRealise }: { id: string, nombreRepetition: number, ordre: number, estRealise: boolean }) {
    this._id = id
    this._nombreRepetition = nombreRepetition
    this._ordre = ordre
    this._estRealise = estRealise
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

  get estRealise(): boolean {
    return this._estRealise
  }

  static creerSerieEntrainement({
                                  id,
                                  nombreRepetition,
                                  ordre,
                                  estRealise
                                }: { id?: string, nombreRepetition: number, ordre: number, estRealise: boolean }) {
    return new SerieEntrainement({ id: id || uuid(), nombreRepetition, ordre, estRealise })
  }
}
