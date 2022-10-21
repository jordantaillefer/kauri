export class CompteUtilisateur {
  private readonly id: string

  constructor(id: string) {
    this.id = id
  }

  getId(): string {
    return this.id
  }

  static creerCompteUtilisateur(id: string) {
    return new CompteUtilisateur(id)
  }
}