export class CompteUtilisateur {
  private readonly _id: string

  constructor(id: string) {
    this._id = id
  }

  get id(): string {
    return this._id
  }

  static creerCompteUtilisateur(id: string) {
    return new CompteUtilisateur(id)
  }
}