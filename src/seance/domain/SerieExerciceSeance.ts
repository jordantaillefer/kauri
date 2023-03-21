import { v4 as uuid } from "uuid"

export class SerieExerciceSeance {
  private readonly _id: string
  private readonly _repetitions: number
  private readonly _ordre: number

  private constructor({ id, repetitions, ordre }: { id: string, repetitions: number, ordre: number }) {
    this._id = id
    this._repetitions = repetitions
    this._ordre = ordre

  }

  get id(): string {
    return this._id
  }

  get repetitions(): number {
    return this._repetitions
  }

  get ordre(): number {
    return this._ordre
  }

  static creerSerieExerciceSeance({ id, repetitions, ordre }: { id?: string, repetitions: number, ordre: number }): SerieExerciceSeance {
    return new SerieExerciceSeance({ id: id || uuid(), repetitions, ordre })
  }
}
