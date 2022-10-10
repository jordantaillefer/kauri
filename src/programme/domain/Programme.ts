import { v4 as uuid } from "uuid"

export class Programme {
  private userId: string
  private nomProgramme: string
  private id: string

  constructor({ id, userId, nomProgramme }: { id: string, userId: string, nomProgramme: string }) {
    this.id = id
    this.userId = userId
    this.nomProgramme = nomProgramme
  }

  static creerProgramme({ id, userId, nomProgramme }: { id?: string, userId: string, nomProgramme: string }): Programme {
    return new Programme({ id: id || uuid(), userId, nomProgramme })
  }
}