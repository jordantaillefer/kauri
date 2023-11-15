
import { randomUUID } from "crypto";

import type { SerieExerciceSeance } from "./SerieExerciceSeance"
import type { CATEGORIE } from "~/server/exercice/domain/categorie"

export class ExerciceSeance {
  private readonly _id: string
  private readonly _idSeance: string
  private readonly _idExercice: string
  private readonly _nomExercice: string
  private readonly _categorie: CATEGORIE
  private readonly _ordre: number
  private _listeSerieExerciceSeance: SerieExerciceSeance[]
  private _tempsRepos: number;

  private constructor({
                        id,
                        idSeance,
                        idExercice,
                        nomExercice,
                        categorie,
                        ordre,
                        tempsRepos,
                        listeSerieExerciceSeance
                      }: { id: string, idSeance: string, idExercice: string, nomExercice: string, categorie: CATEGORIE, ordre: number, tempsRepos: number, listeSerieExerciceSeance: SerieExerciceSeance[] }) {
    this._id = id
    this._idSeance = idSeance
    this._idExercice = idExercice
    this._nomExercice = nomExercice
    this._categorie = categorie
    this._ordre = ordre
    this._tempsRepos = tempsRepos;
    this._listeSerieExerciceSeance = listeSerieExerciceSeance
  }

  get id(): string {
    return this._id
  }

  get idSeance(): string {
    return this._idSeance
  }

  get idExercice(): string {
    return this._idExercice
  }

  get nomExercice(): string {
    return this._nomExercice
  }

  get categorie(): CATEGORIE {
    return this._categorie
  }

  get listeSerieExerciceSeance(): SerieExerciceSeance[] {
    return this._listeSerieExerciceSeance
  }

  get ordre(): number {
    return this._ordre
  }

  get tempsRepos(): number {
    return this._tempsRepos;
  }

  definirSerie(listeSerieExerciceSeance: SerieExerciceSeance[]) {
    this._listeSerieExerciceSeance = listeSerieExerciceSeance
  }

  static creerExerciceSeance({
                               id,
                               idSeance,
                               idExercice,
                               nomExercice,
                               categorie,
                               ordre,
                               tempsRepos,
                               listeSerieExerciceSeance
                             }: { id?: string, idSeance: string, idExercice: string, nomExercice: string, categorie: CATEGORIE, ordre: number, tempsRepos: number, listeSerieExerciceSeance?: SerieExerciceSeance[] }) {
    return new ExerciceSeance({
      id: id || randomUUID(),
      idSeance,
      idExercice,
      nomExercice,
      categorie,
      ordre,
      tempsRepos,
      listeSerieExerciceSeance: listeSerieExerciceSeance || []
    })
  }
}
