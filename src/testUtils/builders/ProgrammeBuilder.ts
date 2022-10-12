import { Programme } from "../../programme/domain/Programme"

export class ProgrammeBuilder {
  private id: string = "id"
  private userId: string = "userId"
  private nomProgramme: string = "nomProgramme"

  withId(id: string): ProgrammeBuilder {
    this.id = id
    return this
  }

  withUserId(userId: string): ProgrammeBuilder {
    this.userId = userId
    return this
  }

  withNomProgramme(nomProgramme: string) {
    this.nomProgramme = nomProgramme
    return this
  }

  build() {
    return Programme.creerProgramme({ id: this.id, userId: this.userId, nomProgramme: this.nomProgramme })
  }
}