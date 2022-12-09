import { v4 as uuid } from "uuid"

import { SeanceEntrainement } from "./SeanceEntrainement"

export class Programme {
  private readonly _id: string
  private readonly _idUtilisateur: string
  private readonly _nomProgramme: string
  private readonly _seancesEntrainement: SeanceEntrainement[]

  constructor({ id, idUtilisateur, nomProgramme }: { id: string, idUtilisateur: string, nomProgramme: string }) {
    this._id = id
    this._idUtilisateur = idUtilisateur
    this._nomProgramme = nomProgramme
    this._seancesEntrainement = []
  }

  get idUtilisateur(): string {
    return this._idUtilisateur
  }

  get nomProgramme(): string {
    return this._nomProgramme
  }

  get id(): string {
    return this._id
  }
  get seancesEntrainement(): SeanceEntrainement[] {
    return this._seancesEntrainement
  }

  static creerProgramme({
                          id,
                          idUtilisateur,
                          nomProgramme
                        }: { id?: string, idUtilisateur: string, nomProgramme: string }): Programme {
    return new Programme({ id: id || uuid(), idUtilisateur, nomProgramme })
  }

  initialiserProgramme() {
    this._seancesEntrainement.push(SeanceEntrainement.creerSeanceEntrainement())
  }

  ajouterSeancesEntrainement(...seancesEntrainement: SeanceEntrainement[]) {
    this._seancesEntrainement.push(...seancesEntrainement)
  }
}