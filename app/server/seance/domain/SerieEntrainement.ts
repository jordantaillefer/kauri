import { randomUUID } from "crypto"

export class SerieEntrainement {
  private readonly _id: string
  private readonly _nombreRepetition: number
  private readonly _tempsRepos: number
  private _estRealise: boolean
  private readonly _ordre: number

  constructor({
    id,
    nombreRepetition,
    tempsRepos,
    ordre,
    estRealise
  }: {
    id: string
    nombreRepetition: number
    tempsRepos: number
    ordre: number
    estRealise: boolean
  }) {
    this._id = id
    this._nombreRepetition = nombreRepetition
    this._tempsRepos = tempsRepos
    this._ordre = ordre
    this._estRealise = estRealise
  }

  get id(): string {
    return this._id
  }

  get nombreRepetition(): number {
    return this._nombreRepetition
  }

  get tempsRepos(): number {
    return this._tempsRepos
  }

  get ordre(): number {
    return this._ordre
  }

  get estRealise(): boolean {
    return this._estRealise
  }

  mettreAJourEstRealise(estRealiseSerie: boolean) {
    this._estRealise = estRealiseSerie
  }

  static creerSerieEntrainement({
    id,
    nombreRepetition,
    tempsRepos,
    ordre,
    estRealise
  }: {
    id?: string
    nombreRepetition: number
    tempsRepos: number
    ordre: number
    estRealise: boolean
  }) {
    return new SerieEntrainement({ id: id || randomUUID(), nombreRepetition, tempsRepos, ordre, estRealise })
  }
}
