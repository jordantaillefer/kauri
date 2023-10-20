import { randomUUID } from "crypto";

import { ExerciceEntrainement } from "./ExerciceEntrainement"

export class Entrainement {
  private readonly _id: string
  private readonly _nomSeance: string
  private readonly _listeExerciceEntrainement: ExerciceEntrainement[]
  private readonly _idUtilisateur: string;

  private constructor({ id, idUtilisateur, nomSeance, listeExerciceEntrainement }: {
    id: string, idUtilisateur: string, nomSeance: string, listeExerciceEntrainement: ExerciceEntrainement[]
  }) {
    this._id = id
    this._nomSeance = nomSeance
    this._idUtilisateur = idUtilisateur
    this._listeExerciceEntrainement = listeExerciceEntrainement
  }

  get id(): string {
    return this._id
  }

  get idUtilisateur(): string {
    return this._idUtilisateur;
  }

  get nomSeance(): string {
    return this._nomSeance
  }

  get listeExerciceEntrainement(): ExerciceEntrainement[] {
    return this._listeExerciceEntrainement
  }

  static creerEntrainement({
                             id,
                             nomSeance,
                             idUtilisateur,
                             listeExerciceEntrainement
                           }: {
    id?: string,
    nomSeance: string,
    idUtilisateur: string,
    listeExerciceEntrainement: ExerciceEntrainement[]
  }) {
    return new Entrainement({
      id: id || randomUUID(),
      nomSeance,
      idUtilisateur,
      listeExerciceEntrainement
    })
  }
}
