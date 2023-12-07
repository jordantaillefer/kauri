import { randomUUID } from "crypto";

export class SerieExerciceSeance {
  private readonly _id: string
  private readonly _repetitions: number
  private readonly _tempsRepos: number
  private readonly _poids: number
  private readonly _ordre: number

  private constructor({ id, repetitions, tempsRepos, poids, ordre }: { id: string, repetitions: number, tempsRepos: number, poids: number, ordre: number }) {
    this._id = id
    this._repetitions = repetitions
    this._tempsRepos = tempsRepos
    this._poids = poids
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

  get poids(): number {
    return this._poids;
  }

  get ordre(): number {
    return this._ordre
  }

  static creerSerieExerciceSeance({ id, repetitions, tempsRepos, poids, ordre }: { id?: string, repetitions: number, tempsRepos: number, poids: number, ordre: number }): SerieExerciceSeance {
    return new SerieExerciceSeance({ id: id || randomUUID(), repetitions, tempsRepos, poids, ordre })
  }
}
