export class SessionUtilisateur {
  private id: string

  constructor({ id }: { id: string}) {
    this.id = id
  }

  static creerSessionUtilisateur({ id }: { id: string }) {
    return new SessionUtilisateur({ id })
  }
}