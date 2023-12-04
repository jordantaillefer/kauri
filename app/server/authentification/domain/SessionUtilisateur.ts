export class SessionUtilisateur {
  private id: string
  private name: { familyName: string, givenName: string}

  constructor({ id, name }: { id: string, name: { familyName: string, givenName: string}}) {
    this.id = id
    this.name = name
  }

  static creerSessionUtilisateur({ id, name }: { id: string, name: { familyName: string, givenName: string} }) {
    return new SessionUtilisateur({ id, name })
  }
}
