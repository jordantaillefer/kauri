export class Programme {
  private userId: string
  private nomProgramme: string

  constructor(userId: string, nomProgramme: string) {
    this.userId = userId
    this.nomProgramme = nomProgramme
  }

  static creerProgramme(userId: string, nomProgramme: string): Programme {
    return new Programme(userId, nomProgramme)
  }
}