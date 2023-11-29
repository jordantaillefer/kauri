import { randomUUID } from "crypto";

export class DetailSerie {
  private readonly _id: string
  private readonly _nombreRepetition: number
  private readonly _tempsRepos: number
  private readonly _ordre: number

  constructor({ id, nombreRepetition, tempsRepos, ordre }: { id: string, nombreRepetition: number, tempsRepos: number, ordre: number }) {
    this._id = id
    this._nombreRepetition = nombreRepetition
    this._tempsRepos = tempsRepos
    this._ordre = ordre
  }

  get id(): string {
    return this._id
  }

  get nombreRepetition(): number {
    return this._nombreRepetition
  }

  get tempsRepos(): number {
    return this._tempsRepos;
  }

  get ordre(): number {
    return this._ordre
  }

  static creerDetailSerie({ id, nombreRepetition, tempsRepos, ordre }: { id: string, nombreRepetition: number, tempsRepos: number, ordre: number }) {
    return new DetailSerie({ id: id || randomUUID(), nombreRepetition, tempsRepos, ordre })
  }
}
