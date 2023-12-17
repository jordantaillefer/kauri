export class CompteUtilisateur {
  private readonly _id: string
  private readonly _nom: string
  private readonly _prenom: string

  constructor({ id, nom, prenom }: { id: string, nom: string, prenom: string }) {
    this._id = id
    this._nom = nom
    this._prenom = prenom
  }

  get id(): string {
    return this._id
  }

  get nom(): string {
    return this._nom
  }

  get prenom(): string {
    return this._prenom
  }

  static creerCompteUtilisateur({ id, nom, prenom }: { id: string, nom: string, prenom: string }) {
    return new CompteUtilisateur({ id, nom, prenom })
  }
}
