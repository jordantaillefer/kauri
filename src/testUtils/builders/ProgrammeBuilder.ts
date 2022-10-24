import { Programme } from "../../programme/domain/Programme"

export class ProgrammeBuilder {
  private id: string = "id"
  private idUtilisateur: string = "idUtilisateur"
  private nomProgramme: string = "nomProgramme"

  withId(id: string): ProgrammeBuilder {
    this.id = id
    return this
  }

  withUserId(idUtilisateur: string): ProgrammeBuilder {
    this.idUtilisateur = idUtilisateur
    return this
  }

  withNomProgramme(nomProgramme: string) {
    this.nomProgramme = nomProgramme
    return this
  }

  build() {
    return Programme.creerProgramme({ id: this.id, idUtilisateur: this.idUtilisateur, nomProgramme: this.nomProgramme })
  }
}