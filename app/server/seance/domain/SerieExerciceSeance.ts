import { randomUUID } from "crypto";

export class SerieExerciceSeance {
  private readonly _id: string
  private readonly _repetitions: number
  private readonly _tempsRepos: number
  private readonly _ordre: number

  private constructor({ id, repetitions,tempsRepos, ordre }: { id: string, repetitions: number, tempsRepos: number, ordre: number }) {
    this._id = id
    this._repetitions = repetitions
    this._tempsRepos = tempsRepos
    this._ordre = ordre

  }

  get id(): string {
    return this._id
  }

  get repetitions(): number {
    return this._repetitions
  }

  get tempsRepos(): number {
    return this._tempsRepos;
  }

  get ordre(): number {
    return this._ordre
  }

  static creerSerieExerciceSeance({ id, repetitions, tempsRepos, ordre }: { id?: string, repetitions: number, tempsRepos: number, ordre: number }): SerieExerciceSeance {
    return new SerieExerciceSeance({ id: id || randomUUID(), repetitions, tempsRepos, ordre })
  }
}
