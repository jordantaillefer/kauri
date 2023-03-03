import { v4 as uuid } from "uuid"

export class SerieExerciceSeance {
  private readonly _id: string
  private readonly _repetitions: number

  private constructor({ id, repetitions }: { id: string, repetitions: number }) {
    this._id = id
    this._repetitions = repetitions
  }

  get id(): string {
    return this._id
  }

  get repetitions(): number {
    return this._repetitions
  }

  static creerSerieExerciceSeance({ id, repetitions }: { id?: string, repetitions: number }): SerieExerciceSeance {
    return new SerieExerciceSeance({ id: id || uuid(), repetitions })
  }
}