import { randomUUID } from "crypto";

export class SportifEvenement {
  private readonly _id: string;
  private readonly _tempsEvenement: string;
  private readonly _idSeance: string;
  private readonly _idUtilisateur: string;

  constructor({
                id,
                tempsEvenement,
                idSeance,
                idUtilisateur
              }: {
    id: string
    tempsEvenement: string
    idSeance: string
    idUtilisateur: string
  }) {
    this._id = id;
    this._tempsEvenement = tempsEvenement;
    this._idSeance = idSeance;
    this._idUtilisateur = idUtilisateur;
  }

  get id(): string {
    return this._id;
  }

  get tempsEvenement(): string {
    return this._tempsEvenement;
  }

  get idSeance(): string {
    return this._idSeance;
  }

  get idUtilisateur(): string {
    return this._idUtilisateur;
  }

  static creerSportifEvenement({
                                 id,
                                 tempsEvenement,
                                 idSeance,
                                 idUtilisateur
                               }: {
    id?: string
    tempsEvenement: string
    idSeance: string
    idUtilisateur: string
  }) {
    return new SportifEvenement({
      id: id || randomUUID(),
      tempsEvenement,
      idSeance,
      idUtilisateur
    });
  }
}
